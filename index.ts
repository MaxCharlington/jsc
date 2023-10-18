import { program as cli } from "commander";
import { createReadStream, createWriteStream, mkdir } from "fs";
import { compile_cpp, format_cpp, outputFullStream, readFullStream } from "./src/compiler.js";
import path from "node:path";
import process from "node:process";
import { transpile } from "./src/transpiler.js";
import { pretranspile } from "./src/pretranspile.js";

const TMP_PATH = "/tmp/jsc-build";

cli
    .name("jsc")
    .description("JavaScript compiler")
    .version("0.1.0");

let inputFilePath;
cli
    .argument("<inputFile>", "JavaScript source file to compile")
    .option("-d, --debug", "emit debug files")
    .option("-o, --output <path>", "executable path", "a.out")
    .action((inputFile) => {
        inputFilePath = inputFile;
    });

cli.parse();
const cli_args = cli.opts();
cli_args.inputFile = inputFilePath;

await mkdir(TMP_PATH, () => {});

const cppSourcePath = path.join(TMP_PATH, path.basename(cli_args.inputFile) + ".cpp");
const outputCodeStream = !cli_args.output ? process.stdout : createWriteStream(cppSourcePath);

//
const jsPretranspiledPath = path.join(TMP_PATH, path.basename(cli_args.inputFile) + ".pretranspiled.js");
await pretranspile(cli_args.inputFile, jsPretranspiledPath);

// Read input
const inputStream = createReadStream(jsPretranspiledPath);
const inputBuffer = await readFullStream(inputStream);

const [base_ast, transpiled_ast, code] = transpile(inputBuffer.toString("utf-8"));

// Write
if (cli_args.debug) {
    const jsBaseASTPath = path.join(TMP_PATH, path.basename(cli_args.inputFile) + ".base.ast.json");
    let outputASTStream = !cli_args.output ? process.stdout : createWriteStream(jsBaseASTPath);
    await outputFullStream(outputASTStream, base_ast);

    const jsTranspiledASTPath = path.join(TMP_PATH, path.basename(cli_args.inputFile) + ".transpiled.ast.json");
    outputASTStream = !cli_args.output ? process.stdout : createWriteStream(jsTranspiledASTPath);
    await outputFullStream(outputASTStream, transpiled_ast);
}
await outputFullStream(outputCodeStream, code);

if (cli_args.debug) {
    format_cpp(cppSourcePath);
}

compile_cpp(cppSourcePath, cli_args.output);
