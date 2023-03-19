import { Literal } from "estree";

function isInt(n: string | number | bigint | boolean | RegExp | undefined) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n: string | number | bigint | boolean | RegExp | undefined) {
    return Number(n) === n && n % 1 !== 0;
}

export function Literal (leaf: Literal) {
    if (leaf.value === null)
    {
        // @ts-ignore
        leaf.cpp_type = "DynamicTyping::Types::null_t";
    }
    else if (isInt(leaf.value))
    {
        // @ts-ignore
        leaf.cpp_type = "DynamicTyping::Types::integer_t";
    }
    else if (isFloat(leaf.value))
    {
        // @ts-ignore
        leaf.cpp_type = "DynamicTyping::Types::float_t";
    }
    else if (typeof leaf.value === "string")
    {
        // @ts-ignore
        leaf.cpp_type = "DynamicTyping::Types::string_t";
    }
    else if (typeof leaf.value === "boolean")
    {
        // @ts-ignore
        leaf.cpp_type = "DynamicTyping::Types::bool_t";
    }
}
