export function VariableDeclarator (leaf, toString) {
  if (leaf.init)
  {
    const constness = leaf.cpp_constness && leaf.init.type !== 'ArrayExpression' ? 'const ' : ''
    const type = (leaf.init.cpp_type ? `${leaf.init.cpp_type} ` : 'auto ')
    return `${constness}${type}${toString(leaf.id)}=${toString(leaf.init)}`
  }
  if (leaf.init === null)
  {
    return `DynamicTyping::var ${toString(leaf.id)}`;
  }
  return toString(leaf.id)
}

export function VariableDeclaration (leaf, toString) {
  return leaf.declarations.map(toString).join() + ';'
}
