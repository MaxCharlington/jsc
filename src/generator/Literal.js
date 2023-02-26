export function Literal (leaf) {
  if (typeof leaf.value === 'string') {
    return `"${leaf.value}"` || `"${leaf.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"')}"`
  }
  if (leaf.value === null) {
    return 'nullptr'
  }
  return leaf.raw !== undefined ? leaf.raw : String(leaf.value)
}
