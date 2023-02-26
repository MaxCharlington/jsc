export function ArrayExpression (leaf, toString) {
    if (!leaf.elements.length) return "std::vector<DynamicTyping::var>{}";
    return `std::vector<DynamicTyping::var>{${
        toString({
            type: "SequenceExpression",
            expressions: leaf.elements
        })
    }}`;
}
