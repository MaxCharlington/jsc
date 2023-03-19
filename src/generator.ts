import { Node } from "estree";
import * as Generator from "./generator/index.js";

const defaultState = {
    strictMode: true
};

// Generates c++ code based on transpiled AST and applied optimizations
export default function GenerateCode (tree: Node, options: any = null): string {
    function GenerateCodeStateful (leaf: Node): string {
        // @ts-ignore
        const cl = Generator[leaf.type];
        if (!cl) throw new Error(`Unknown type ${leaf.type}`);
        return cl(leaf, GenerateCodeStateful);
    }
    Object.assign(GenerateCodeStateful, defaultState, options);
    return GenerateCodeStateful(tree);
}
