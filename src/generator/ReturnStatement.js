export function ReturnStatement (leaf, toString) {
    return `return ${toString(leaf.argument ?? {
        type: "Identifier",
        name: "undefined"
    })};`;
}
