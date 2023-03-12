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
    {
        return DynamicTyping::typeof_impl(variable);
    }
    else if constexpr (std::is_same_v<DynamicTyping::bool_t, Type>)
    {
        return "boolean";
    }
    else if constexpr (std::is_integral_v<Type> or std::is_floating_point_v<Type>)
    {
        return "number";
    }
    else if constexpr (DynamicTyping::CString<Type>)
    {
        return "string";
    }
    else if constexpr (std::is_same_v<Type, DynamicTyping::object_t> or is_string_map_v<Type> or std::is_same_v<Type, DynamicTyping::null_t>)
    {
        // Check for object before array because object is array inside
        return "object";
    }
    else if constexpr (is_array_or_vector_v<Type>)
    {
        return "array";
    }
    else if constexpr (std::is_same_v<Type, DynamicTyping::undefined_t>)
    {
        return "undefined";
    }
}
