export function UnaryExpression (leaf, toString) {
    if (leaf.operator === "typeof") {
        return `_typeof(${toString(leaf.argument)})`;
    }
    else if (leaf.operator === "void") {
        return "DynamicTyping::Types::undefined";
    }
    return leaf.prefix
        ? leaf.operator + toString(leaf.argument)
        : toString(leaf.argument) + leaf.operator;
}
