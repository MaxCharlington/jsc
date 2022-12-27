#include <ast_impl.hpp>
#include <execution.hpp>

consteval auto create_execution_context()
{
    constexpr auto& prog = compiled_json::prog::impl::document;
    static_assert(prog["type"].get<std::string_view>() == "Program");
    Execution rntm{prog["body"]};
    // ... calcs
    return [=]{ return rntm; };
}

int main()
{
    constexpr auto execution_context_repr = to_runtime<create_execution_context>();
    Execution e{execution_context_repr};
    e.run();
}
