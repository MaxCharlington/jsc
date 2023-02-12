# jsc

JavaScript compiler that creates executable form .js file using compile time AST parsing and C++ compiler

## Build
1. Install dependancies:
   - g++-12
   - clang-15++
   - pip3
   - conan
   - cmake>=3.22
   - node>=16

> Other dependancies are installed automatically by pip3 and conan while building.

1. Clone repo with:
```sh
git clone --recurse-submodules https://github.com/MaxCharlington/jsc
```

2. Build:
```sh
npm i
npm run build
```
> This command emits build directory in the repo folder.

3. Package:
```sh
npm run package
```
> This command creates build/_CPack_Packages folder which containes packages in form of deb and tar.gz and build/install folder with raw installation files.

4. Install package locally:
```sh
sudo cp -r build/install/* /usr/local
```
