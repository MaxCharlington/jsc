export function FunctionDeclaration (leaf, toString) {
  let str = `constexpr auto ${leaf.id.name}(`;
  for (let i = 0; i < leaf.params.length; i++) {
    str += `auto ${toString(leaf.params[i])}=arguments[${i}];`
  }
  str += ')'
  str += toString(leaf.body)
  return str
}
