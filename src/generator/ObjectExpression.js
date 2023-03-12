export function Property (leaf, toString) {
    return `DynamicTyping::field_t{"${toString(leaf.key)}", ${toString(leaf.value)}}`;
}

export function ObjectExpression (leaf, toString) {
    if (!leaf.properties.length) return "DynamicTyping::object_t()";
    return `DynamicTyping::object_t{${
        toString({
            type: "SequenceExpression",
            expressions: leaf.properties
        })
    }}`;
}
