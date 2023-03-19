import { UpdateExpression } from "estree";

export function UpdateExpression (leaf: UpdateExpression) {
    // @ts-ignore
    leaf.type = "UnaryExpression";
}
