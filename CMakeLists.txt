cmake_minimum_required(VERSION 3.22)

project(jsc VERSION 0.1.0.0)

add_custom_target(generate_json_ast ALL)

add_custom_command(TARGET generate_json_ast
    COMMAND pkg src/generate_json_ast.js --compress GZip -t node16-linux -o ${CMAKE_BINARY_DIR}/generate_json_ast
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    DEPENDS src/generate_json_ast.js
    VERBATIM
)

install(PROGRAMS src/jsc DESTINATION bin)

install(FILES
        deps/helpers/ct2rt.hpp
        deps/helpers/overloaded.hpp
        deps/helpers/remove_all_const.hpp
        deps/helpers/template_strings.hpp
        DESTINATION include/jscompiler)

install(FILES
        deps/cest/include/cest/string.hpp
        deps/cest/include/cest/ios.hpp
        deps/cest/include/cest/ios_base.hpp
        deps/cest/include/cest/basic_ios.hpp
        deps/cest/include/cest/ostream.hpp
        deps/cest/include/cest/streambuf.hpp
        deps/cest/include/cest/runtime_ostream.hpp
        DESTINATION include/cest)

install(FILES
        src/CMakeLists.txt
        src/prog.cpp
        DESTINATION etc/jscompiler)

install(PROGRAMS
        ${CMAKE_BINARY_DIR}/deps/json2cpp/src/json2cpp
        ${CMAKE_BINARY_DIR}/generate_json_ast
        DESTINATION bin/jscompiler)

install(DIRECTORY
        include/
        deps/dt/include/
        DESTINATION include/jscompiler)

install(DIRECTORY
        deps/json2cpp/include/
        DESTINATION include)

# overwrite install() command with a dummy macro that is a nop
macro (install)
endmacro ()
set(ENABLE_CPPCHECK_DEFAULT OFF CACHE BOOL "" FORCE)
set(ENABLE_CLANG_TIDY_DEFAULT OFF CACHE BOOL "" FORCE)
set(ENABLE_TESTING OFF CACHE BOOL "" FORCE)
set(ENABLE_FUZZING OFF CACHE BOOL "" FORCE)
set(ENABLE_LARGE_TESTS OFF CACHE BOOL "" FORCE)
set(USER_CXX_STANDARD 23 CACHE BOOL "" FORCE)
set(CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR}/deps/json2cpp ${CMAKE_MODULE_PATH})
set(CMAKE_PREFIX_PATH ${CMAKE_BINARY_DIR}/deps/json2cpp ${CMAKE_PREFIX_PATH})

add_subdirectory(deps/json2cpp)

set(CPACK_PACKAGE_VERSION_MAJOR ${PROJECT_VERSION_MAJOR})
set(CPACK_PACKAGE_VERSION_MINOR ${PROJECT_VERSION_MINOR})
set(CPACK_PACKAGE_VERSION_PATCH ${PROJECT_VERSION_PATCH})

set(CPACK_PACKAGE_NAME ${PROJECT_NAME}${PROJECT_VERSION_MAJOR} CACHE STRING "Package name")
set(CPACK_VERBATIM_VARIABLES YES)
set(CPACK_DEBIAN_PACKAGE_MAINTAINER "MaxCharlington")
set(CPACK_RESOURCE_FILE_README "${CMAKE_SOURCE_DIR}/README.md")
set(CPACK_DEBIAN_PACKAGE_DEPENDS "g++ (>= 12.1), cmake (>= 3.22)")
set(CPACK_GENERATOR TGZ DEB)

include(CPack)
