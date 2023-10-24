#pragma once

#include <functional>
#include <tuple>
#include <type_traits>
#include <utility>

#include "types.hpp"

namespace DynamicTyping {

namespace details {
    template<typename>
    struct is_ref_getter_pair: std::false_type {};

    template<typename T, typename Getter>
    struct is_ref_getter_pair<std::pair<std::reference_wrapper<T>, Getter>>: std::true_type {};

    template<typename T>
    constexpr bool is_ref_getter_pair_v = is_ref_getter_pair<T>::value;

    template<typename T>
    concept RefGetterPair = is_ref_getter_pair_v<T>;
}

template<details::RefGetterPair... Ts>
class tie {
public:
    constexpr tie(Ts... data) : m_data{data...} {}

    tie(const tie&) = delete;
    tie(tie&&) = delete;

    constexpr void operator=(const auto& source) && {
        unpack(source);
    }

private:
    template <std::size_t ParamIndex = 0>
    [[gnu::always_inline]] constexpr void unpack(const auto& source) const {
        if constexpr (sizeof...(Ts) > ParamIndex) {
            auto [ref_wrapped, getter] = std::get<ParamIndex>(m_data);
            auto& ref = ref_wrapped.get();
            using T = std::remove_reference_t<decltype(ref)>;
            ref = static_cast<T>(getter(source));
            unpack<ParamIndex + 1>(source);
        }
    }

    std::tuple<std::pair<typename Ts::first_type, typename Ts::second_type>...> m_data;
};

namespace details {
    [[gnu::always_inline]] constexpr auto evalSegment(auto&& source, auto segment) {
        using Type = std::remove_cvref_t<decltype(segment)>;
        if constexpr (std::convertible_to<Type, std::size_t> or Types::StringLike<Type>)
        {
            return source[segment];
        }
        else if constexpr (std::invocable<Type, decltype(source)>) {
            return segment(source);
        }
        else
        {
            throw std::runtime_error{"Unevaluatable segment"};
        }
    }

    /// @note Required to be before variadic overload
    template <typename T>
    [[gnu::always_inline]] constexpr auto unwrap(auto&& source, T segment) {
        return evalSegment(source, segment);
    }

    template <typename T, typename... Ts> requires (sizeof...(Ts) > 0)
    [[gnu::always_inline]] constexpr auto unwrap(auto&& source, T segment, Ts... segments) {
        return unwrap(evalSegment(source, segment), segments...);
    }
}

namespace Unpack::Getters {
    template <typename... Ts>
    constexpr auto path(Ts... segments) {
        return [...segments = segments](auto&& source){
            return details::unwrap(source, segments...);
        };
    }
}

[[gnu::always_inline]] constexpr auto tie_el(auto& variable, auto getter) {
    return std::pair{std::ref(variable), getter};
}

} // namespace DynamicTyping
