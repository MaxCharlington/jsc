import { Node, VariableDeclaration } from "estree";

export function VariableDeclaration (leaf: VariableDeclaration, state: any, ancestors: Array<Node>) {
    const trace = ancestors.filter(node => node.type === "FunctionDeclaration" || node.type === "FunctionExpression");
    // @ts-ignore
    if (trace.length === 0) leaf.cpp_global = true;
    else {
        const declared_in = trace[trace.length - 1];
        // @ts-ignore
        if (declared_in.cpp_declares === undefined) declared_in.cpp_declares = [];
        // @ts-ignore
        declared_in.cpp_declares.push(leaf.declarations[0].id.name);
    }
}
