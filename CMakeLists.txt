cmake_minimum_required(VERSION 3.22)

project(jsc)

add_custom_target(generate_json_ast ALL)

add_custom_command(TARGET generate_json_ast
    COMMAND npm run build_generate_json_ast
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    DEPENDS src/generate_json_ast.js
    VERBATIM
)

install(FILES src/jsc TYPE BIN)
install(FILES ${CMAKE_BINARY_DIR}/generate_json_ast TYPE BIN)
# install(FILES json2cpp TYPE BIN)  # TODO: build with project
install(DIRECTORY include/ TYPE INCLUDE)
install(FILES src/CMakeLists.txt TYPE DATA)
install(FILES src/prog.cpp TYPE DATA)
# TODO: install deps
