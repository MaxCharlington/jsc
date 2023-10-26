#!/usr/bin/env bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
UNITS_DIR=${SCRIPT_DIR}/../tests/units
INTEGR_DIR=${SCRIPT_DIR}/../tests/integration

echo Pretest cleanup
rm -rf /tmp/jsc-build && mkdir /tmp/jsc-build  # TODO: no tmp dir

echo Building unit tests
cmake -B ${UNITS_DIR}/build ${UNITS_DIR} \
    -DCMAKE_BUILD_TYPE=Debug -DCMAKE_INSTALL_PREFIX=build/install
cmake --build ${UNITS_DIR}/build --config Debug --parallel $(nproc)

echo Running unit tests
${UNITS_DIR}/build/test_js
${UNITS_DIR}/build/test_runtime
${UNITS_DIR}/build/test_type_interop

echo Running integration tests
node --test ${INTEGR_DIR}/test_basic.js

echo All tests passed
