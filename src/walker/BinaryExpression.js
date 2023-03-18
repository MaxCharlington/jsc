export function BinaryExpression (leaf) {
    if (leaf.operator === "instanceof") {
        throw new Error("instanceof not supported");
    }
}
