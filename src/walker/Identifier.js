export function Identifier(leaf, state, ancestors) {
    const trace = ancestors.filter(node => node.type === "FunctionDeclaration" || node.type === "FunctionExpression");
    if (trace.length > 0) {
        const used_in = trace[trace.length - 1];
        if (used_in.cpp_uses === undefined) used_in.cpp_uses = [];
        used_in.cpp_uses.push(leaf.name);
    }
}
