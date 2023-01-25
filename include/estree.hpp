#ifndef AST_HPP
#define AST_HPP

#include <expected>
#include <memory>
#include <variant>
#include <dynamic_typing.hpp>

#include <ast_impl.hpp>

namespace AST {

template<typename T>
using result_t = std::expected<T, std::string>;

struct Position
{
    uint64_t line;  // >= 1
    uint64_t column;  // >= 0

    constexpr static result_t<Position> make(const auto& pos)
    {
        // TODO: json2cpp containes is not supported
        // if (not pos.contains("line") or not pos.contains("column"))
        //     return std::unexpected("Object doesn't contain 'line' or 'column'");

        if (not pos["line"].is_number_unsigned() or pos["line"].template get<uint64_t>() < 1 or not pos["column"].is_number_unsigned())
            return std::unexpected("Field 'line' or 'column' field does not fit the requirements");

        return Position{pos["line"].template get<uint64_t>(), pos["column"].template get<uint64_t>()};
    }
};

struct SourceLocation
{
    Position start;
    Position end;

    constexpr static result_t<SourceLocation> make(const auto& loc)
    {
        // if (not loc.contains("start") or not loc.contains("end"))
        //     return std::unexpected("Object doesn't contain 'start' or 'end'");

        auto start = Position::make(loc["start"]);
        if (not start.has_value()) return std::unexpected(start.error());

        auto end = Position::make(loc["end"]);
        if (not end.has_value()) return std::unexpected(end.error());

        return SourceLocation{start.value(), end.value()};
    }
};

struct Node
{
    std::string_view type;
    SourceLocation loc;

    constexpr static result_t<Node> make(const auto& node)
    {
        // if (not node.contains("type") or not node.contains("loc"))
        //     return std::unexpected("Object doesn't contain 'type' or 'loc'");

        if (not node.is_object() or not node["type"].is_string() or not node["loc"].is_object())
            return std::unexpected("Field 'type' or 'loc' does not fit the requirements or 'node' is illformed");

        std::string_view type = node["type"].template get<std::string_view>();

        auto source_loc = SourceLocation::make(node["loc"]);

        if (not source_loc.has_value()) return std::unexpected(source_loc.error());

        return Node{type, source_loc.value()};
    }
};

template<typename Child, typename Parent>
constexpr static result_t<Child> make_child(const auto& child)
{
    auto par = Parent::make(child);

    if (not par.has_value()) return std::unexpected(par.error());

    Child res;
    static_cast<Node&>(res) = par.value();

    return res;
}

struct Statement : Node {
    constexpr static result_t<Statement> make(const auto& statement)
    {
        return make_child<Statement, Node>(statement);
    }
};

struct Expression : Node {
    constexpr static result_t<Expression> make(const auto& expr)
    {
        return make_child<Expression, Node>(expr);
    }
};

struct Pattern : Node {
    constexpr static result_t<Pattern> make(const auto& ptrn)
    {
        return make_child<Pattern, Node>(ptrn);
    }
};

struct Declaration : Statement {
    constexpr static result_t<Declaration> make(const auto& decl)
    {
        return make_child<Declaration, Statement>(decl);
    }
};

struct DebuggerStatement : Statement {
    constexpr static result_t<DebuggerStatement> make(const auto& deb)
    {
        return make_child<DebuggerStatement, Statement>(deb);
    }
};

struct ThisExpression : Expression {
    constexpr static result_t<ThisExpression> make(const auto& this_expr)
    {
        return make_child<ThisExpression, Expression>(this_expr);
    }
};

struct VariableDeclaration;
struct ExpressionStatement;
struct BlockStatement;
struct FunctionBody;
struct ReturnStatement;
struct IfStatement;
struct SwitchStatement;
struct WhileStatement;
struct DoWhileStatement;
struct ForStatement;
struct ForInStatement;
struct FunctionDeclaration;

struct ExpressionStatement : Statement
{
    Expression expression;
};

struct Identifier : Expression, Pattern
{
    std::string_view name;
};

struct Literal : Expression
{
    DynamicTyping::data_t value;
};

struct Directive : ExpressionStatement
{
    Literal expression;
    std::string_view directive;
};

struct Program : Node
{
    std::vector<std::variant<Directive, std::unique_ptr<Statement>>> body;
};

struct BlockStatement : Statement
{
    std::vector<std::unique_ptr<Statement>> body;
};

struct FunctionBody : BlockStatement
{
    std::vector<std::variant<Directive, std::unique_ptr<Statement>>> body;
};

struct ReturnStatement : Statement
{
    std::variant<Expression, nullptr_t> argument;
};

struct IfStatement : Statement
{
    Expression test;
    std::unique_ptr<Statement> consequent;
    std::variant<std::unique_ptr<Statement>, nullptr_t> alternate;
};

struct SwitchCase : Node
{
    std::variant<Expression, nullptr_t> test;
    std::vector<std::unique_ptr<Statement>> consequent;
};

struct SwitchStatement : Statement
{
    Expression discriminant;
    std::vector<SwitchCase> cases;
};

struct WhileStatement : Statement
{
    Expression test;
    std::unique_ptr<Statement> body;
};

struct DoWhileStatement : Statement
{
    std::unique_ptr<Statement> body;
    Expression test;
};

struct VariableDeclarator : Node
{
    Pattern id;
    std::variant<Expression, nullptr_t> init;
};

struct VariableDeclaration : Declaration
{
    std::vector<VariableDeclarator> declarations;
};

struct ForStatement : Statement
{
    std::variant<VariableDeclaration, Expression, nullptr_t> init;
    std::variant<Expression, nullptr_t> test;
    std::variant<Expression, nullptr_t> update;
    std::unique_ptr<Statement> body;
};

struct ForInStatement : Statement
{
    std::variant<VariableDeclaration, Pattern> left;
    Expression right;
    std::unique_ptr<Statement> body;
};

struct Function : Node
{
    std::variant<Identifier, nullptr_t> id;
    std::vector<Pattern> params;
    FunctionBody body;
};

struct FunctionDeclaration : Function, Declaration
{
    Identifier id;
};

struct ArrayExpression : Expression
{
    std::vector<std::variant<Expression, nullptr_t>> elements;
};

struct FunctionExpression : Function, Expression {};

// struct UpdateExpression : Expression
// {
//     UpdateOperator operator;
//     Expression argument;
//     bool prefix;
// };

// struct BinaryExpression : Expression
// {
//     BinaryOperator operator;
//     Expression left;
//     Expression right;
// };

struct MemberExpression : Expression, Pattern
{
    Expression object;
    Expression property;
    bool computed;
};

struct CallExpression : Expression
{
    Expression callee;
    std::vector<Expression> arguments;
};

}  // namespace AST

#endif  // AST_HPP
