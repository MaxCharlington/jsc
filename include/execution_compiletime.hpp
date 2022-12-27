#pragma once

#include <vector>
#include <utility>

#include <types.hpp>

using namespace DynamicTyping::Types;

struct sizes_t
{
    std::size_t integral_constants_size{};
    std::size_t runtime_op_size{};

    constexpr bool zeroed() const
    {
        std::array<std::byte, sizeof(sizes_t)> nullarr{};
        return nullarr == std::bit_cast<std::array<std::byte, sizeof(sizes_t)>>(*this);
    }
};

struct runtime_op_t {
    std::size_t i;

    template<class R>
    void operator()()
    {
        std::cout << R::s_integral_constants[i];
    }
};

struct runtime_op_creator_t
{
    std::string_view name;

    constexpr runtime_op_t operator()() const
    {
        return runtime_op_t{0};
    }
};

struct Compiletime
{
    std::vector<std::pair<std::string_view, std::size_t>> integral_constants_indexes;
    std::vector<integer_t> integral_constants;
    std::vector<runtime_op_creator_t> ops;

    constexpr Compiletime(const auto& prog_body)
    {
        for (auto &body_item : prog_body)
        {
            if (body_item["type"].template get<std::string_view>() == "VariableDeclaration")
            {
                integral_constants.push_back(body_item["declarations"][0]["init"]["value"].template get<integer_t>());
                integral_constants_indexes.push_back({body_item["declarations"][0]["id"]["name"].template get<std::string_view>(), integral_constants.size() - 1});
            }
            else if (body_item["type"].template get<std::string_view>() == "ExpressionStatement")
            {
                ops.push_back(runtime_op_creator_t{body_item["expression"]["arguments"][0]["name"].template get<std::string_view>()});
            }
        }
    }

    constexpr auto sizes()
    {
        return sizes_t{
            integral_constants.size(),
            ops.size()
        };
    }

    template<sizes_t S>
    constexpr auto serialize()
    {
        std::array<integer_t, S.integral_constants_size> integral_constants_repr;
        std::copy_n(integral_constants.data(), S.integral_constants_size, integral_constants_repr.data());

        std::array<runtime_op_t, S.runtime_op_size> runtime_ops;
        for (size_t op_i = 0; op_i < S.runtime_op_size; op_i++)
        {
            runtime_ops[op_i] = ops[op_i]();
        }
        return std::make_tuple(integral_constants_repr, runtime_ops);
    }
};
