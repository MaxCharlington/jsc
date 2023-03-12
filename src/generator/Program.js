export function Program (leaf, toString) {
    leaf.type = "BlockStatement";
    return `
    #include <jscompiler/library.hpp>
    ${leaf.functions.map(toString).join("\n")}
    int main(int argc, const char* argv[])
    ${toString(leaf)}
  `;
}
