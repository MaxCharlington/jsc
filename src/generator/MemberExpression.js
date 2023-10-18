export function MemberExpression (leaf, toString) {
    let str = toString(leaf.object);
    const computed = leaf.computed;
    let accessor = "";
    if (computed)
    {
        if (leaf.property.type === "Literal")
        {
            accessor = `[${toString(leaf.property)}]`;
        }
        else if (leaf.property.type === "Identifier")
        {
            accessor = `[${leaf.property.name}]`;
        }
    }
    else
    {
        accessor = `.${toString(leaf.property)}`;
    }
    str += accessor;
    return str;
}
