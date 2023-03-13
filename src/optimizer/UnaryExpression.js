export function UnaryExpression(leaf) {
    if (leaf.operator == "-")
        leaf.cpp_type = leaf.argument.cpp_type;
}
