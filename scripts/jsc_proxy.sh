#!/usr/bin/env bash

# This script is proxy workaround that allows to obtain
# current directory path from jsc bundle produced with bun

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

INCLUDE_DIR=$SCRIPT_DIR/../jsc/src/library exec -a jsc $SCRIPT_DIR/../jsc/dist/jsc $@
