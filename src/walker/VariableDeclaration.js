export function VariableDeclaration (leaf, state, ancestors) {
    const trace = ancestors.filter(node => node.type === "FunctionDeclaration" || node.type === "FunctionExpression");
    if (trace.length === 0) leaf.cpp_global = true;
    else {
        const declared_in = trace[trace.length - 1];
        if (declared_in.cpp_declares === undefined) declared_in.cpp_declares = [];
        declared_in.cpp_declares.push(leaf.declarations[0].id.name);
    }
}
