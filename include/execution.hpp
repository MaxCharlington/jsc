#ifndef EXEC_HPP
#define EXEC_HPP

#include <ct2rt.hpp>
#include <dynamic_typing.hpp>

#include "execution_compiletime.hpp"

using namespace DynamicTyping;
using namespace DynamicTyping::Types;

struct dummy {};

template<sizes_t Sizes>
class Execution : public std::conditional_t<Sizes.zeroed(), Compiletime, dummy>
{
    static inline std::array<integer_t, Sizes.integral_constants_size> s_integral_constants{};
    static inline std::array<var, Sizes.variables_size> s_variables{};

    static inline std::array<runtime_op_t<Execution>, Sizes.runtime_op_size> s_ops{};

    friend struct runtime_op_t<Execution>;

public:
    void run()
    {
        std::ranges::for_each(s_ops, [](auto &op){ op(); });
    }

    constexpr Execution(const auto& prog_body) : Compiletime{prog_body} {}

    Execution(const DynamicTyping::Types::Blob::CIsTuple auto& repr)
    {
        s_integral_constants = std::get<0>(repr);
        // variables
        s_ops = std::get<2>(repr);
    }
};

// Runtime ececution
template <typename ...T, std::size_t ...S>
Execution(const std::tuple<std::array<T, S>...>& repr) -> Execution<sizes_t{S...}>;

// Compiletime execution
template<typename AST>
Execution(const AST&) -> Execution<sizes_t{}>;

#endif  // EXEC_HPP
