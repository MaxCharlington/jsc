if (BUILD_TESTS EQUAL 1)

add_compile_options(-Og -ggdb -Wall -Wextra -Wconversion -Wno-unused-variable -DDEBUG -fsanitize=undefined)
add_link_options(-fsanitize=undefined)
include_directories(${CMAKE_SOURCE_DIR}/src/library/typing)
include_directories(${CMAKE_SOURCE_DIR}/deps/helpers)

# add_executable(test_blob         test_blob.cpp)
# add_executable(test_compiletime  test_compiletime.cpp)
add_executable(test_js           test_js.cpp)
add_executable(test_runtime      test_runtime.cpp)
add_executable(test_type_interop test_type_interop.cpp)

# target_compile_features(test_blob PRIVATE cxx_std_23)
# target_compile_features(test_compiletime PRIVATE cxx_std_23)
target_compile_features(test_js PRIVATE cxx_std_23)
target_compile_features(test_runtime PRIVATE cxx_std_23)
target_compile_features(test_type_interop PRIVATE cxx_std_23)

endif()
