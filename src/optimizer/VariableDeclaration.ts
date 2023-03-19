import { VariableDeclaration } from "estree";

export function VariableDeclaration (leaf: VariableDeclaration) {
    leaf.declarations.forEach(declaration_leaf => {
        // @ts-ignore
        declaration_leaf.cpp_constness = (leaf.kind === "const");
    });
}
