import { TaggedTemplateExpression } from "estree";
import { TemplateElement } from "./TemplateLiteral.js";

export function TaggedTemplateExpression (leaf: TaggedTemplateExpression) {
    // @ts-ignore
    leaf.type = "CallExpression";
    // @ts-ignore
    leaf.callee = leaf.tag;
    // @ts-ignore
    leaf.arguments = [
        {
            type: "ArrayExpression",
            elements: leaf.quasi.quasis.map(TemplateElement)
        },
        ...leaf.quasi.expressions
    ];
}
