import { ContinueStatement } from "estree";

export function ContinueStatement (leaf: ContinueStatement) {
    if (leaf.label) {
        throw new Error("Continue must not have label");
    }
}
