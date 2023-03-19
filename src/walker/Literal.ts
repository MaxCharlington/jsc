import { Literal, RegExpLiteral } from "estree";

export function Literal (leaf: Literal | RegExpLiteral ) {
    if ((leaf as RegExpLiteral).regex) throw new Error("RegExp not implemented");
}
