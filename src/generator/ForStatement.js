const empty = { type: "EmptyStatement" };

export function ForStatement (leaf, toString) {
    let str = "for (";
    str += toString(leaf.init ?? empty);
    str += toString(leaf.test ?? empty) + ";";
    if (leaf.update) str += toString(leaf.update);
    str += ") ";
    str += toString(leaf.body);
    return str;
}

export function ForInStatement (leaf, toString) {
    return `DynamicTyping::for_in(${toString(leaf.right)}, [&](auto ${loop_var})${toString(leaf.body)});`;
}

export function ForOfStatement (leaf, toString) {
    const loop_var = leaf.left.declarations[0].id.name;
    return `DynamicTyping::for_of(${toString(leaf.right)}, [&](auto ${loop_var})${toString(leaf.body)});`;
}
