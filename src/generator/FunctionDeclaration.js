export function FunctionDeclaration (leaf, toString) {
    let str = `constexpr auto ${leaf.id.name}(`;
    str += leaf.params.map((par) => `auto ${toString(par)}`).join(", ");
    str += ")";
    str += toString(leaf.body);
    return str;
}
