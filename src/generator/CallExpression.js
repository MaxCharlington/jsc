export function CallExpression (leaf, toString) {
    return `${toString(leaf.callee)}(${
        toString({
            type: "SequenceExpression",
            expressions: leaf.arguments ?? []
        })
    })`;
}

export function NewExpression (leaf, toString) {
    throw new Error("new* not supported");
    // return `New(${toString(leaf.callee)})(${
    //     toString({
    //         type: "SequenceExpression",
    //         expressions: leaf.arguments ?? []
    //     })
    // })`;
}
