import { Property } from "estree";

export function Property (leaf: Property) {
    if (leaf.kind !== "init") {
        throw new Error("Propetry getter/setter not implemented");
    }
}
