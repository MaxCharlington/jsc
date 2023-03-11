import { simple } from "acorn-walk";
import * as Optimizer from "./optimizer/index.js";

// Applies optimizations and adds them to ast
export default function OptimizeAST (tree) {
    simple(tree, Optimizer);
}
