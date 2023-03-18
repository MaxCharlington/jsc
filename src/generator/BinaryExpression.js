const FunctionBinaryOperators = {
    "===": "_strict_equal",
    "!==": "not _strict_equal",
    // instanceof: "InstanceOf",
    // in: "KeyInObject",
    ">>>": "_unsigned_right_shift",
    "??": "_nullish_coalescing"
};

export function BinaryExpression (leaf, toString) {
    if (FunctionBinaryOperators[leaf.operator]) {
        let str = `${FunctionBinaryOperators[leaf.operator]}(`;
        str += toString({
            type: "SequenceExpression",
            expressions: [leaf.left, leaf.right]
        });
        str += ")";
        return str;
    }
    let str = "";
    str += leaf.left.type === "BinaryExpression"
        ? `(${toString(leaf.left)})`
        : toString(leaf.left);
    str += ` ${leaf.operator} `;
    str += leaf.right.type === "BinaryExpression"
        ? `(${toString(leaf.right)})`
        : toString(leaf.right);
    return str;
}
