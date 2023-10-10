#pragma once

#include "dynamic_typing.hpp"

namespace DynamicTyping {

using namespace Types;

class ForOfView
{
private:
    using iterator_base =
        std::vector<
            std::variant<
                string_t::value_type,  // for string
                std::reference_wrapper<var>  // for array and TODO: iterable object?
            >
        >::iterator;

public:
    struct Iterator : iterator_base
    {
        template<typename T, typename Type = std::remove_cvref_t<T>>
            requires std::same_as<Type, string_t::iterator> ||
                     std::same_as<Type, array_t::iterator>
        constexpr Iterator(T it) : m_it{it}, m_cur_value{} {
            if constexpr (std::same_as<Type, string_t::iterator>)
                m_cur_value = *it;
            else
                m_cur_value = std::ref(*it);
        }

        constexpr reference operator*() { return m_cur_value; }
        constexpr pointer operator->() { return &m_cur_value; }

        constexpr Iterator& operator++() {
            std::visit(
                overloaded{
                    [&](string_t::iterator& it) { m_cur_value = *(++it); },
                    [&](array_t::iterator& it){ m_cur_value = std::ref(*(++it)); }
                },
                m_it
            );
            return *this;
        }

        constexpr Iterator operator++(int) {
            Iterator tmp = *this;
            ++(*this);
            return tmp;
        }

        friend constexpr bool operator==(const Iterator& a, const Iterator& b) {
            return a.m_it == b.m_it;
        }

        friend constexpr bool operator!=(const Iterator& a, const Iterator& b) {
            return !(a == b);
        }

    private:
        std::variant<string_t::iterator, array_t::iterator> m_it;
        value_type m_cur_value;
    };

    constexpr ForOfView(var& d) : m_data{d.data} {
        if (std::holds_alternative<integer_t>(m_data) ||
            std::holds_alternative<object_t>(m_data)) {
            throw std::runtime_error{"Not iterable"};
        }
    }

    constexpr Iterator begin() {
        return std::visit(
            overloaded{
                [](string_t& str) -> Iterator { return str.begin(); },
                [](array_t& arr) -> Iterator { return arr.begin(); },
                []<typename T>(T) -> Iterator { throw std::runtime_error{"Not iterable type: " + std::string{typeid(T).name()}}; }
            },
            m_data
        );
    }

    constexpr Iterator end() {
        return std::visit(
            overloaded{
                [](string_t& str) -> Iterator { return str.end(); },
                [](array_t& arr) -> Iterator { return arr.end(); },
                []<typename T>(T) -> Iterator { throw std::runtime_error{"Not iterable type: " + std::string{typeid(T).name()}}; }
            },
            m_data
        );
    }

private:
    data_t& m_data;
};

class ForInView
{
private:
    using iterator_base =
        std::vector<
            std::variant<
                array_t::size_type,  // for array
                std::reference_wrapper<const string_t> // for object
            >
        >::iterator;

public:
    struct Iterator : iterator_base
    {
        template<typename T, typename Type = std::remove_cvref_t<T>>
            requires std::same_as<Type, array_t::iterator> ||
                     std::same_as<Type, object_t::iterator>
        constexpr Iterator(T it) : m_it{it}, m_cur_value{0uz} {
            if constexpr (std::same_as<Type, object_t::iterator>)
            {
                m_cur_value = (*it).first;
            }
            // already initialized for arrays for else case
        }

        constexpr reference operator*() { return m_cur_value; }
        constexpr pointer operator->() { return &m_cur_value; }

        constexpr Iterator& operator++() {
            std::visit(
                overloaded{
                    [&](array_t::iterator& it){
                        it++; std::get<std::size_t>(m_cur_value)++;
                    },
                    [&](object_t::iterator& it){
                        m_cur_value = (*(++it)).first;
                    }
                },
                m_it
            );
            return *this;
        }

        constexpr Iterator operator++(int) {
            Iterator tmp = *this;
            ++(*this);
            return tmp;
        }

        friend constexpr bool operator==(const Iterator& a, const Iterator& b) {
            return a.m_it == b.m_it;
        }

        friend constexpr bool operator!=(const Iterator& a, const Iterator& b) {
            return !(a == b);
        }

    private:
        std::variant<array_t::iterator, object_t::iterator> m_it;
        value_type m_cur_value;
    };

    constexpr ForInView(var& d) : m_data{d.data} {
        if (not std::holds_alternative<array_t>(m_data.get()) &&
            not std::holds_alternative<object_t>(m_data.get()))
        {
            // if type is unsupported we do not throw and make no iterations
            static data_t empty = array_t{};
            m_data = empty;
        }
    }

    constexpr Iterator begin() {
        return std::visit(
            overloaded{
                [](array_t& arr) -> Iterator { return arr.begin(); },
                [](object_t& obj) -> Iterator { return obj.begin(); },
                []<typename T>(T) -> Iterator { throw std::runtime_error{"Not iterable type: " + std::string{typeid(T).name()}}; }
            },
            m_data.get()
        );
    }

    constexpr Iterator end() {
        return std::visit(
            overloaded{
                [](array_t& arr) -> Iterator { return arr.end(); },
                [](object_t& obj) -> Iterator { return obj.end(); },
                []<typename T>(T) -> Iterator { throw std::runtime_error{"Not iterable type: " + std::string{typeid(T).name()}}; }

            },
            m_data.get()
        );
    }

private:
    /// @note not a simple ref because in some case of not supported type needed
    ///       to be reassigned to behavior in complience with ECMAScript spec
    std::reference_wrapper<data_t> m_data;
};

template<typename Iterable, typename Callable>
constexpr void for_of(Iterable&& iterable, Callable&& callable) {
    using Type = std::remove_cvref_t<Iterable>;
    if constexpr (std::same_as<Type, var>) {
        for (auto el_var_ref : ForOfView(iterable)) {
            std::visit(overloaded{
                [&](char ch){ if constexpr (std::invocable<Callable, char>) callable(ch); },
                [&](var& v){ if constexpr (std::invocable<Callable, var&>) callable(v); }
            }, el_var_ref);
        }
    }
    else if constexpr (std::same_as<Type, string_t>) {
        if constexpr (std::invocable<Callable, char>) {
            for (char ch : iterable) {
                callable(ch);
            }
        }
    }
    else {
        throw std::runtime_error{"Type is not iterable"};
    }
}

template<typename Iterable, typename Callable>
constexpr void for_in(Iterable&& iterable, Callable&& callable) {
    if constexpr (std::same_as<Iterable, var>) {
        for (auto el_var_ref : ForInView(iterable)) {
            std::visit(overloaded{
                [&](const string_t& key) { if constexpr (std::invocable<Callable, const string_t&>) callable(key); },
                [&](array_t::size_type index) { if constexpr (std::invocable<Callable, array_t::size_type>) callable(index); }
            }, el_var_ref);
        }
    }
}

} // namespace DynamicTyping
