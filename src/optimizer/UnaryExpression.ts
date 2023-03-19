import { UnaryExpression } from "estree";

export function UnaryExpression(leaf: UnaryExpression) {
    if (leaf.operator == "-")
        // @ts-ignore
        leaf.cpp_type = leaf.argument.cpp_type;
}
