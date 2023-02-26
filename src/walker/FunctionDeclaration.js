export function FunctionDeclaration (leaf, state) {
    state.functions.push(JSON.parse(JSON.stringify(leaf)));
    leaf.type = "EmptyStatement";
}
