import * as Generator from './generator/index.js'

const defaultState = {
  strictMode: true
}

export default function GenerateCode (tree, options) {
  function GenerateCodeStateful (leaf) {
    const cl = Generator[leaf.type]
    if (!cl) throw new Error(`Unknown type ${leaf.type}`)
    return cl(leaf, GenerateCodeStateful)
  }
  Object.assign(GenerateCodeStateful, defaultState, options)
  return GenerateCodeStateful(tree)
}
