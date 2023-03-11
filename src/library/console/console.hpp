#pragma once

#include <iostream>
#include <cest/string.hpp>

std::ostream& operator<<(std::ostream& out, const cest::string& str)
{
    out << str.c_str();
    return out;
}

struct Console
{
    constexpr auto log(const auto& ...args)
    {
        using namespace DynamicTyping;  // to use << operator of var
        // TODO: support multiple args with space as separator
        (std::cout << ... << args);
        std::cout << std::endl;
    }

    constexpr auto error(auto&& ...args)
    {
        using namespace DynamicTyping;  // to use << operator of var
        // TODO: support multiple args with space as separator
        (std::cerr << ... << args);
        std::cerr << std::endl;
    }
};

inline Console console;
