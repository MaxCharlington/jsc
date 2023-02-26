import * as Acorn from 'acorn'
import WalkAST from './walker.js'
import OptimizeAST from './optimizer.js'
import GenerateCode from './generator.js'

export default function Transpile (code, options = {}) {
    const ast = Acorn.parse(code, {
        ecmaVersion: 6,
        ...(options.parser ?? {})
    });
    const base_ast_str = JSON.stringify(ast, null, 4);
    try {
        WalkAST(ast);
    } catch (cause) {
        console.error(new Error('Failed to transpile', { cause }));
    }
    try {
        OptimizeAST(ast);
    } catch (cause) {
        console.error(new Error('Failed to optimize', { cause }));
    }
    const modified_ast_str = JSON.stringify(ast, null, 4);
    let cpp_source = "";
    try {
        cpp_source = GenerateCode(ast);
    } catch (cause) {
        console.error(new Error('Code generation failed', { cause }));
    }
    return [base_ast_str, modified_ast_str, cpp_source];
}
