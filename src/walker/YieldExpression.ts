import { YieldExpression } from "estree";

export function YieldExpression (leaf: YieldExpression) {
    if (leaf.delegate) {
        throw new Error("yield* not supported");
    }
}
