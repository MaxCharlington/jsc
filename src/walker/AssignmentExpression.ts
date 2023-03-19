import { AssignmentExpression } from "estree";

const nativeOperators = [
    "=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="
];

export function AssignmentExpression (leaf: AssignmentExpression) {
    if (!nativeOperators.includes(leaf.operator)) {
        leaf.right = {
            type: "BinaryExpression",
            // @ts-ignore
            left: leaf.left,
            // @ts-ignore
            operator: leaf.operator.replace("=", ""),
            right: leaf.right
        };
        leaf.operator = "=";
    }
}
