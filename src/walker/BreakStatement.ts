import { BreakStatement } from "estree";

export function BreakStatement (leaf: BreakStatement) {
    if (leaf.label) {
        throw new Error("Break must not have label");
    }
}
