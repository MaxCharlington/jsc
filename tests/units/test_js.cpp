#include <cassert>
#include <iostream>
#include <vector>

#include <dynamic_typing.hpp>
#include <loops.hpp>

using namespace DynamicTyping;

int main()
{
    std::cout << "typeof tests:\n";
    var variable;
    std::cout << variable << ' ' << typeof_impl(variable) << '\n';

#define C ,  // workaround to use commas in macro
#define test(val)\
    { \
        var variable = val; \
        std::cout << variable << ' ' << typeof_impl(variable) << '\n'; \
    }

    test(1);
    test(1.6);
    test(array_t{1 C 2 C 3 C 4});
    test(object_t{{"name" C "max"} C {"age" C 23}});
    test(nullptr);
    test(NaN);
    test(true);
    test("asdas");

#undef test
#undef C


    std::cout << "\nsuccsessfull for of and for in tests:\n";
    {
        variable = "asdasd";
        for_of(variable, [](char ch){ std::cout << ch; });
        std::cout << std::endl;

        variable = array_t{1, "asd", 3.5};
        for_of(variable, [](var& el){ std::cout << el << '\n'; });

        variable = array_t{1, "asd", 3.5};
        for_in(variable, [](std::size_t index){ std::cout << index << '\n'; });

        variable = object_t{{"name", "max"}, {"age", 23}};
        for_in(variable, [&](const string_t& key){ std::cout << key << ' ' << variable[key] << '\n'; });
    }
    std::cout << "\nthrowing for of and for in tests:\n";

    {
        bool all_thrown = true;
        var not_compat = array_t{1, 1.6, nullptr, NaN, true, object_t{{"name", "max"}, {"age", 23}}};
        for_of(not_compat, [&](var& i)
        {
            std::cout << i << std::endl;
            try
            {
                for_of(i, [](auto){});
                all_thrown = false;
            }
            catch(...) {}
        });
        assert(all_thrown);
    }

    {
        bool no_thrown = true;
        var not_compat = array_t{1, 1.6, nullptr, NaN, true, "asdasdas"};
        for_of(not_compat, [&](var& i)
        {
            std::cout << i << std::endl;
            try
            {
                for_in(i, [](auto){});
            }
            catch(...) {
                no_thrown = false;
            }
        });
        assert(no_thrown);
    }
}
