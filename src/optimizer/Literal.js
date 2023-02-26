function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

export function Literal (leaf) {
    if (leaf.value === null)
    {
        leaf.cpp_type = "DynamicTyping::Types::null_t";
    }
    else if (isInt(leaf.value))
    {
        leaf.cpp_type = "DynamicTyping::Types::integer_t";
    }
    else if (isFloat(leaf.value))
    {
        leaf.cpp_type = "DynamicTyping::Types::float_t";
    }
    else if (typeof leaf.value === "string")
    {
        leaf.cpp_type = "DynamicTyping::Types::string_t";
    }
    else if (typeof leaf.value === "boolean")
    {
        leaf.cpp_type = "DynamicTyping::Types::bool_t";
    }
}
