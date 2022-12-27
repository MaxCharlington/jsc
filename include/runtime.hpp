#pragma once

#include <vector>
#include <ct2rt.hpp>
#include <dynamic_typing.hpp>
#include <blob_types.hpp>

using namespace DynamicTyping;
using namespace DynamicTyping::Types;

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

struct sizes_t
{
    std::size_t integral_constants_size{};
    std::size_t runtime_op_size{};
};

template<sizes_t Sizes = {}>
class Execution
{
    std::vector<std::pair<std::string_view, std::size_t>> integral_constants_indexes;
    std::vector<integer_t> integral_constants;
    std::vector<runtime_op_creator_t> ops;

    static inline std::array<integer_t, Sizes.integral_constants_size> s_integral_constants{};
    static inline std::array<runtime_op_t, Sizes.runtime_op_size> s_ops{};

    friend struct runtime_op_t;

public:
    void run()
    {
        std::ranges::for_each(s_ops, [](auto &op){ op.template operator()<Execution>(); });
    }

    constexpr Execution() = default;

    constexpr Execution(const auto& prog_body)
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

    Execution(const DynamicTyping::Types::Blob::CIsTuple auto& repr)
    {
        s_integral_constants = std::get<0>(repr);
        s_ops = std::get<1>(repr);
    }
};
