export function VariableDeclarator (leaf, toString) {
  if (leaf.init) {
    const constness = leaf.cpp_constness ? 'const ' : ''
    const type = (leaf.init.cpp_type ? `${leaf.init.cpp_type} ` : 'auto ')
    return `${constness}${type}${toString(leaf.id)}=${toString(leaf.init)}`
  }
  return toString(leaf.id)
}

export function VariableDeclaration (leaf, toString) {
  return leaf.declarations.map(toString).join() + ';'
}
