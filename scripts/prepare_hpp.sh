#!/usr/bin/env bash

set -e

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Provide header as first argument"

if [ ! -f "$1" ]; then
    die "File \"$1\"not found"
fi

FNAME=$(basename $1)
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo Preprocessing header $FNAME
g++-13 -w -E -std=c++23 $1 -I $SCRIPT_DIR/../deps/helpers/ > $SCRIPT_DIR/../dist/jsc.hpp
