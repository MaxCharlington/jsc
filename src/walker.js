import { ancestor } from "acorn-walk";
import * as handlers from "./walker/index.js";

// Prepares AST for c++ generation
export default function WalkAST(tree) {
    const cpp_state = {
        functions: []
    };
    ancestor(tree, handlers, null, cpp_state);

    tree.functions = cpp_state.functions;
}
