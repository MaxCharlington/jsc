import { Identifier, Node } from "estree";

export function Identifier(leaf: Identifier, state: any, ancestors: Array<Node>) {
    const trace = ancestors.filter(node => node.type === "FunctionDeclaration" || node.type === "FunctionExpression");
    if (trace.length > 0) {
        const used_in = trace[trace.length - 1];
        // @ts-ignore
        if (used_in.cpp_uses === undefined) used_in.cpp_uses = [];
        // @ts-ignore
        used_in.cpp_uses.push(leaf.name);
    }
}
