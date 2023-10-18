# jsc

## Installation

Basic intallation requires g++ >= 13, cmake >= 3.22, bun >= 1.0.2.

Tests integration still rely on node test API.

Some steps also require sudo privilages.
```bash
git clone --recurse-submodules https://github.com/MaxCharlington/jsc
bun install     # installs npm packages
bun run build   # configures cmake
bun run package # creating packages with cmake (creates DEB and TGZ packages)
bun run lockal_install # installs build to a /usr/local (linux only)
```

## Testing

Next command creates fresh package with debug enabled, installs it and runs all tests.
Currently there are units for C++ internal lib and integrations for testing whole compiler results.
```bash
bun run test
```

## Usage

Basic usage for a single file project
```bash
jsc /path/to/file.js -o /path/to/created/executable
```

## Standard complience

Currently implementation is not complient with ECMA. Its planned to add some APIs to be compatible with node.
