cmake_minimum_required(VERSION 3.22)

project(jsc
        VERSION 0.1.0.0
        DESCRIPTION "JavaScript compiler"
        HOMEPAGE_URL https://github.com/MaxCharlington/jsc)

set(JSC_BUNDLE ${PROJECT_NAME})
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Building
add_custom_command(
    COMMAND bun build ${CMAKE_SOURCE_DIR}/index.ts --compile --minify --outfile=${CMAKE_BINARY_DIR}/${JSC_BUNDLE}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    DEPENDS ${CMAKE_SOURCE_DIR}/index.ts
    OUTPUT ${CMAKE_BINARY_DIR}/${JSC_BUNDLE}
    VERBATIM
)

add_custom_target(${PROJECT_NAME} ALL DEPENDS ${CMAKE_BINARY_DIR}/${JSC_BUNDLE})

# Packaging
install(PROGRAMS
        ${CMAKE_BINARY_DIR}/${JSC_BUNDLE}
        DESTINATION bin)

set(CPP_HELPERS_HEADERS_PATH "${CMAKE_SOURCE_DIR}/deps/helpers/")
set(CPP_HELPERS_HEADERS
    ${CPP_HELPERS_HEADERS_PATH}/ct2rt.hpp
    ${CPP_HELPERS_HEADERS_PATH}/overloaded.hpp
    ${CPP_HELPERS_HEADERS_PATH}/remove_all_const.hpp
    ${CPP_HELPERS_HEADERS_PATH}/template_strings.hpp)

install(FILES
        FILES ${CPP_HELPERS_HEADERS}
        DESTINATION include/jscompiler)

install(DIRECTORY
        src/library/
        DESTINATION include/jscompiler)

set(CPACK_PACKAGE_VERSION_MAJOR ${PROJECT_VERSION_MAJOR})
set(CPACK_PACKAGE_VERSION_MINOR ${PROJECT_VERSION_MINOR})
set(CPACK_PACKAGE_VERSION_PATCH ${PROJECT_VERSION_PATCH})

set(CPACK_PACKAGE_NAME ${PROJECT_NAME}${PROJECT_VERSION_MAJOR} CACHE STRING "Package name")
set(CPACK_VERBATIM_VARIABLES YES)
set(CPACK_DEBIAN_PACKAGE_MAINTAINER "MaxCharlington")
set(CPACK_RESOURCE_FILE_README "${CMAKE_SOURCE_DIR}/README.md")
set(CPACK_DEBIAN_PACKAGE_DEPENDS "g++ (>= 13.1)")
set(CPACK_GENERATOR TGZ DEB)

include(CPack)

# Testing
add_subdirectory(${CMAKE_SOURCE_DIR}/tests/units)
