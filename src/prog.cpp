#include <execution.hpp>
#include <estree.hpp>

#include <ast_impl.hpp>

consteval auto create_execution_context()
{
    constexpr auto& prog = compiled_json::prog::impl::document;
    constexpr auto prog_node = AST::Node::make(compiled_json::prog::impl::document).value();
    static_assert(prog_node.type == "Program", "Invalid JSON AST");
    static_assert(not prog["body"].empty(), "Program body is empty");
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
