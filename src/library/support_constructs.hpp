#include <jscompiler/dynamic_typing.hpp>

template<typename T>
struct is_array_or_vector : std::false_type {};

template<typename T, std::size_t N>
struct is_array_or_vector<std::array<T, N>> : std::true_type {};

template<typename T, typename Allocator>
struct is_array_or_vector<std::vector<T, Allocator>> : std::true_type {};

template<typename T>
constexpr bool is_array_or_vector_v = is_array_or_vector<T>::value;


template<typename T>
struct is_string_map : std::false_type {};

template<typename V>
struct is_string_map<std::unordered_map<cest::string, V>> : std::true_type {};

template<typename T>
constexpr bool is_string_map_v = is_string_map<T>::value;


template<typename T>
constexpr auto _typeof(const T& variable) -> const char*
{
    using Type = std::remove_cvref_t<T>;

    if constexpr (std::is_same_v<Type, DynamicTyping::var>)
        return DynamicTyping::typeof_impl(variable);
    else if constexpr (std::is_same_v<DynamicTyping::bool_t, Type>)
        return "boolean";
    else if constexpr (std::is_integral_v<Type> or std::is_floating_point_v<Type>)
        return "number";
    else if constexpr (DynamicTyping::CString<Type>)
        return "string";
    else if constexpr (is_array_or_vector_v<Type> or  // for arrays
        std::is_same_v<Type, DynamicTyping::object_t> or
        is_string_map_v<Type> or
        std::is_same_v<Type, DynamicTyping::null_t>
    )
        // Check for object before array because object is array inside
        return "object";
    else if constexpr (std::is_same_v<Type, DynamicTyping::undefined_t>)
        return "undefined";
}

template<typename T1, typename T2>
constexpr bool _strict_equal(const T1& val1, const T2& val2)
{
    if constexpr (std::same_as<T1, T2>)
        return val1 == val2;
    else if constexpr (std::same_as<T1, DynamicTyping::var> or std::same_as<T2, DynamicTyping::var>)
        return DynamicTyping::strict_equal_impl(val1, val2);
    else if (DynamicTyping::CString<T1> and DynamicTyping::CString<T2>)
        return val1 == val2;
    else if (DynamicTyping::CArithmetic<T1> and DynamicTyping::CArithmetic<T2>
        and not std::same_as<T1, DynamicTyping::Types::bool_t> and not std::same_as<T2, DynamicTyping::Types::bool_t>
    )
        return val1 == val2;
    else
        return false;
}
