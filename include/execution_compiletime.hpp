#pragma once

#include <cctype>
#include <vector>
#include <utility>

#include <ast_impl.hpp>
#include <dynamic_typing.hpp>

using namespace DynamicTyping;
using namespace DynamicTyping::Types;

struct sizes_t
{
    std::size_t integral_constants_size{};
    std::size_t variables_size{};
    std::size_t runtime_op_size{};

    constexpr bool zeroed() const
    {
        std::array<std::byte, sizeof(sizes_t)> nullarr{};
        return nullarr == std::bit_cast<std::array<std::byte, sizeof(sizes_t)>>(*this);
    }
};

enum class op_type
{
    LOG
    , LOG_VAR  // tmp
    , READ
};

template<class R>
struct runtime_op_t {
    op_type type;
    std::size_t r_integral_constant_index{};
    std::size_t r_variable_index{};
    std::size_t l_variable_index{};

    void operator()()
    {
        if (type == op_type::LOG)
        {
            std::cout << R::s_integral_constants[r_integral_constant_index] << std::endl;
        }
        else if (type == op_type::LOG_VAR)
        {
            std::cout << R::s_variables[r_variable_index] << std::endl;
        }
        else if (type == op_type::READ)
        {
            std::cin >> R::s_variables[l_variable_index];
        }
    }
};

template<sizes_t>
class Execution;

struct Compiletime
{
    struct runtime_op_creator_t
    {
        op_type type;
        std::string_view identifier_name{};
        std::string_view l_variable_name{};

        template<sizes_t S>
        constexpr runtime_op_t<Execution<S>> operator()(const Compiletime& ctx) const
        {
            if (type == op_type::LOG)
            {
                const auto& integral_constants_indexes_it = std::ranges::find_if(
                    ctx.integral_constants_indexes,
                    [&](const std::pair<std::string_view, std::size_t>& pair) { return pair.first == identifier_name; }
                );
                if (integral_constants_indexes_it != ctx.integral_constants_indexes.end())
                    return { .type = type, .r_integral_constant_index=integral_constants_indexes_it->second};
                const auto& variables_indexes_it = std::ranges::find_if(
                    ctx.variables_indexes,
                    [&](const std::pair<std::string_view, std::size_t>& pair) { return pair.first == identifier_name; }
                );
                if (variables_indexes_it != ctx.variables_indexes.end())
                    return { .type = op_type::LOG_VAR, .r_variable_index=variables_indexes_it->second};
            }
            else if (type == op_type::READ)
            {
                std::size_t variable_index = std::ranges::find_if(
                    ctx.variables_indexes,
                    [&](const std::pair<std::string_view, std::size_t>& pair) { return pair.first == l_variable_name; }
                )->second;
                return { .type = type, .l_variable_index=variable_index };
            }
        }
    };

    std::vector<std::pair<std::string_view, std::size_t>> integral_constants_indexes;
    std::vector<integer_t> integral_constants;

    std::vector<std::pair<std::string_view, std::size_t>> variables_indexes;
    std::vector<var> variables;

    std::vector<runtime_op_creator_t> ops;

    constexpr Compiletime(const auto& prog_body)
    {
        for (auto &body_item : prog_body)
        {
            // TODO: extract parsing
            if (body_item["type"].template get<std::string_view>() == "VariableDeclaration")
            {
                if (body_item["kind"].template get<std::string_view>() == "const")
                {
                    if (body_item["declarations"][0]["init"]["value"].is_number_integer())
                    {
                        integral_constants.emplace_back(body_item["declarations"][0]["init"]["value"].template get<integer_t>());
                        integral_constants_indexes.emplace_back(body_item["declarations"][0]["id"]["name"].template get<std::string_view>(), integral_constants.size() - 1);
                    }
                }
                else if (body_item["kind"].template get<std::string_view>() == "let")
                {
                    variables.emplace_back(body_item["declarations"][0]["init"]["value"].template get<integer_t>());
                    variables_indexes.emplace_back(body_item["declarations"][0]["id"]["name"].template get<std::string_view>(), variables.size() - 1);
                }
            }
            else if (body_item["type"].template get<std::string_view>() == "ExpressionStatement")
            {
                if (body_item["expression"]["type"].template get<std::string_view>() == "CallExpression")
                {
                    // LOG
                    if (body_item["expression"]["callee"]["property"]["name"].template get<std::string_view>() == "log")
                        ops.push_back(runtime_op_creator_t{ .type=op_type::LOG, .identifier_name = body_item["expression"]["arguments"][0]["name"].template get<std::string_view>()});
                }
                else if (body_item["expression"]["type"].template get<std::string_view>() == "AssignmentExpression")
                {
                    // READ
                    if (body_item["expression"]["right"]["callee"]["property"]["name"].template get<std::string_view>() == "read")
                        ops.push_back(runtime_op_creator_t{ .type=op_type::READ, .l_variable_name=body_item["expression"]["left"]["name"].template get<std::string_view>() });
                }
            }
        }
    }

    constexpr auto sizes()
    {
        return sizes_t{
            integral_constants.size(),
            variables.size(),
            ops.size()
        };
    }

    template<sizes_t S>
    constexpr auto serialize()
    {
        std::array<integer_t, S.integral_constants_size> integral_constants_repr;
        std::copy_n(integral_constants.data(), S.integral_constants_size, integral_constants_repr.data());

        std::array<nullptr_t, S.variables_size> runtime_variables;  // TODO: transfer values

        std::array<runtime_op_t<Execution<S>>, S.runtime_op_size> runtime_ops;
        for (size_t op_i = 0; op_i < S.runtime_op_size; op_i++)
        {
            runtime_ops[op_i] = ops[op_i].template operator()<S>(*this);
        }
        return std::make_tuple(integral_constants_repr, runtime_variables, runtime_ops);
    }
};
