export function FunctionExpression(leaf, toString) {
    let str = "[=](";
    for (let i = 0; i < leaf.params.length; i++) {
        str += `auto ${toString(leaf.params[i])}=arguments[${i}];`;
    }
    str += ")";
    str += toString(leaf.body);
    return str;
}
