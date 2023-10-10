export function CatchClause (leaf, toString) {
    return ` catch (std::exception& ${toString(leaf.param)}) ${toString(leaf.body)}`;
}

export function TryStatement (leaf, toString) {
    let str = `try ${toString(leaf.block)}`;
    if (leaf.handler) str += toString(leaf.handler);
    // if (leaf.finalizer) {
    //     str += " finally ";
    //     str += toString(leaf.finalizer);
    // } // TODO: implement finally
    return str;
}
