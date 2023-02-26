export function VariableDeclaration (leaf) {
    leaf.declarations.forEach(declaration_leaf => {
        declaration_leaf.cpp_constness = (leaf.kind === "const");
    });
}
