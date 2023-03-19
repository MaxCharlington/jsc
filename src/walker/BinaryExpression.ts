import { BinaryExpression } from "estree";

export function BinaryExpression (leaf: BinaryExpression) {
    if (leaf.operator === "instanceof") {
        throw new Error("instanceof not supported");
    }
}
