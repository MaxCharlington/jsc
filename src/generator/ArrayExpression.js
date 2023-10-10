export function ArrayExpression (leaf, toString) {
    if (!leaf.elements.length) return "DynamicTyping::array_t{}";
    return `DynamicTyping::array_t{${
        toString({
            type: "SequenceExpression",
            expressions: leaf.elements
        })
    }}`;
}
