export function FunctionDeclaration(leaf, state) {
    let is_capturing = false;
    if (leaf.cpp_declares.length === leaf.cpp_uses.length) {
        const cpp_declares = leaf.cpp_declares.sort();
        const cpp_uses = leaf.cpp_uses.sort();

        for (let i = 0; i < cpp_declares.length; i++) {
            if (cpp_declares[i] !== cpp_uses[i]) {
                is_capturing = true;
                break;
            }
        }
    }
    else {
        is_capturing = true;
    }

    if (is_capturing) {
        const func_expression = JSON.parse(JSON.stringify(leaf));
        func_expression.type = "FunctionExpression";
        func_expression.id = null;
        func_expression.generator = false;
        func_expression.expression = false;
        func_expression.async = false;

        const name = leaf.id.name;

        delete leaf.body;
        delete leaf.expression;
        delete leaf.generator;
        delete leaf.async;
        delete leaf.params;
        delete leaf.id;
        delete leaf.cpp_declares;
        delete leaf.cpp_uses;

        leaf.type = "VariableDeclaration";
        leaf.kind = "const";
        leaf.declarations = [{
            type: "VariableDeclarator",
            id: { type: "Identifier", name },
            init: func_expression,
        }];
    }
    else
    {
        state.functions.push(JSON.parse(JSON.stringify(leaf)));
        leaf.type = "EmptyExpression";
    }
}
