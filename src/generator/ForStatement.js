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
    return `for (${toString(leaf.left)} : ${toString(leaf.right)}) ` + toString(leaf.body);
}

export function ForOfStatement (leaf, toString) {
    let loop_var = toString(leaf.left);
    loop_var = loop_var.substring(0, loop_var.length - 1);
    return `for (${loop_var} : ${toString(leaf.right)}) ` + toString(leaf.body);
}
