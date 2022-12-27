#!/bin/bash
set -x
set -e

SCRIPT_PATH="$(dirname -- "${BASH_SOURCE[0]}")"
TMP_PATH="${SCRIPT_PATH}/build"  # TODO: move to /tmp?

rm -rf ${TMP_PATH}
mkdir -p ${TMP_PATH}

echo ---------- Generating AST json ----------
command -v node >/dev/null 2>&1 || { echo >&2 "node is required. Aborting."; exit 1; }
node ${SCRIPT_PATH}/generate_json_ast $1 ${TMP_PATH}/ast.json

echo ---------- Generating AST c++ constexpr representation ----------
command -v json2cpp >/dev/null 2>&1 || { echo >&2 "json2cpp is required. Aborting."; exit 1; }
json2cpp prog ${TMP_PATH}/ast.json ${TMP_PATH}/ast

# TODO: Supports only g++. Move to cmake and add wasm generation support
echo ---------- Compiling AST to exe ----------
INSTALL_PATH="${SCRIPT_PATH}/../build/install/include"
DT_INCLUDES="-I${SCRIPT_PATH}/../deps/dt/include"
HELPERS_INCLUDES="-I${SCRIPT_PATH}/../deps/helpers"
INCLUDES="-I${SCRIPT_PATH}/../include ${HELPERS_INCLUDES} ${DT_INCLUDES}"
command -v g++ >/dev/null 2>&1 || { echo >&2 "json2cpp is required. Aborting."; exit 1; }
g++ -std=c++2b ${INCLUDES} -I${TMP_PATH} ${SCRIPT_PATH}/prog.cpp -o ${TMP_PATH}/$2 -O3 -ggdb
