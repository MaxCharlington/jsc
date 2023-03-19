import { ArrowFunctionExpression, FunctionExpression as FE } from "estree";
import { FunctionExpression } from "./FunctionExpression.js";

export function ArrowFunctionExpression (leaf: any) {
    leaf.type = "FunctionExpression";
    if (leaf.expression) {
        leaf.body = {
            type: "BlockStatement",
            body: [
                {
                    type: "ReturnStatement",
                    arguments: leaf.body
                }
            ]
        };
    }
    FunctionExpression(leaf as FE);
}
