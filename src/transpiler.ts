import * as Acorn from "acorn";
import process from "node:process";
import WalkAST from "./walker.js";
import OptimizeAST from "./optimizer.js";
import GenerateCode from "./generator.js";

export default function Transpile (code: string): [string, string, string] {
    const ast = Acorn.parse(code, { ecmaVersion: 6 });
    const base_ast_str = JSON.stringify(ast, null, 4);
    try {
        WalkAST(ast);
    } catch (cause) {
        console.error(new Error("Failed to transpile" + cause));
        process.exit(1);
    }
    try {
        OptimizeAST(ast);
    } catch (cause) {
        console.error(new Error("Failed to optimize" + cause));
        process.exit(1);
    }
    const modified_ast_str = JSON.stringify(ast, null, 4);
    let cpp_source = "";
    try {
        // @ts-ignore
        cpp_source = GenerateCode(ast);
    } catch (cause) {
        console.error(new Error("Code generation failed" + cause));
        process.exit(1);
    }
    return [base_ast_str, modified_ast_str, cpp_source];
}
