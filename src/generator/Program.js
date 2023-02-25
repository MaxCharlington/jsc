export function Program (leaf, toString) {
  leaf.type = 'BlockStatement';
  return `
    #include <jscompiler/dynamic_typing.hpp>
    ${leaf.functions.map(toString).join('\n')}
    int main(int argc, const char* argv[])
    ${toString(leaf)}
  `;
}
