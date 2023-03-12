function type(leaf) {
    let is_const = leaf.cpp_constness && leaf.init.type !== "ArrayExpression" && leaf.init.type !== "ObjectExpression";
    let cpp_type = (leaf.init.cpp_type && leaf.cpp_constness ? leaf.init.cpp_type : "DynamicTyping::var");
    if (leaf.init.type === "FunctionExpression") cpp_type = "auto";
    if (leaf.init.type === "ArrayExpression" && leaf.cpp_constness) cpp_type = "DynamicTyping::array_t";
    if (leaf.init.type === "ObjectExpression" && leaf.cpp_constness) cpp_type = "DynamicTyping::object_t";
    return `${is_const ? "const " : ""}${cpp_type} `;
}

export function VariableDeclarator (leaf, toString) {
    if (leaf.init)
        return `${type(leaf)}${toString(leaf.id)}=${toString(leaf.init)}`;
    if (leaf.init === null)
        return `DynamicTyping::var ${toString(leaf.id)}`;
    return toString(leaf.id);
}

export function VariableDeclaration (leaf, toString) {
    return leaf.declarations.map(toString).join() + ";";
}
