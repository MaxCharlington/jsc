import * as Acorn from 'acorn'
import WalkAST from './src/walker.js'
import OptimizeAST from './src/optimizer.js'
import GenerateCode from './src/generator.js'

import { program as cli } from 'commander'
import { once } from 'events'
import { createReadStream, createWriteStream, rm, mkdir } from 'fs'
import path from "node:path";
import { exec } from 'node:child_process';
import { exit } from 'process'

const TMP_PATH = "/tmp/jsc-build";

export default function Transpile (code, options = {}) {
  const ast = Acorn.parse(code, {
    ecmaVersion: 6,
    ...(options.parser ?? {})
  })
  const base_ast_str = JSON.stringify(ast, null, 4);
  try {
    WalkAST(ast)  // prepares ast for generation
  } catch (cause) {
    console.error(new Error('Failed to transpile', { cause }));
  }
  try {
    OptimizeAST(ast)
  } catch (cause) {
    console.error(new Error('Failed to optimize', { cause }));
  }
  const modified_ast_str = JSON.stringify(ast, null, 4);
  let cpp_source = ""
  try {
    cpp_source = GenerateCode(ast)
  } catch (cause) {
    console.error(new Error('Code generation failed', { cause }));
  }
  return [base_ast_str, modified_ast_str, cpp_source]
}

cli
  .name('jsc')
  .description('JavaScript compiler')
  .version('0.1.0');

let inputFilePath;
cli
  .argument('<inputFile>', 'JavaScript source file to compile')
  .option('-a, --ast', 'emit ast file')
  .option('-o, --output <path>', 'executable path', 'a.out')
  .action((inputFile) => {
    inputFilePath = inputFile;
  });

cli.parse();
const cli_args = cli.opts();
cli_args.inputFile = inputFilePath;

async function readFullStream (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

async function outputFullStream (stream, data) {
  for (let i = 0; i < data.length;) {
    const flushed = stream.write(data.slice(i, i += stream.writableHighWaterMark))
    if (!flushed) {
      await once(stream, 'drain')
    }
  }
  stream.end()
}

// await rm(TMP_PATH, { recursive: true, force: true }, (err) => {
//   if (err) {
//     exit(1);
//   }
// });
await mkdir(TMP_PATH, () => {});

const cppSourcePath = path.join(TMP_PATH, path.basename(cli_args.inputFile) + '.cpp');
const outputCodeStream = !cli_args.output ? process.stdout : createWriteStream(cppSourcePath);

// Read input
const inputStream = createReadStream(cli_args.inputFile);
const inputBuffer = await readFullStream(inputStream);

const [base_ast, transpiled_ast, code] = Transpile(inputBuffer.toString('utf-8'));

// Write
if (cli_args.ast) {
  const jsBaseASTPath = path.join(TMP_PATH, path.basename(cli_args.inputFile) + '.base.ast.json');
  let outputASTStream = !cli_args.output ? process.stdout : createWriteStream(jsBaseASTPath);
  await outputFullStream(outputASTStream, base_ast);

  const jsTranspiledASTPath = path.join(TMP_PATH, path.basename(cli_args.inputFile) + '.transpiled.ast.json');
  outputASTStream = !cli_args.output ? process.stdout : createWriteStream(jsTranspiledASTPath);
  await outputFullStream(outputASTStream, transpiled_ast);
}
await outputFullStream(outputCodeStream, code);

exec(`node_modules/clang-format/bin/linux_x64/clang-format ${cppSourcePath} > ${path.join(path.dirname(cppSourcePath), path.basename(cppSourcePath, '.cpp') + '.formatted.cpp')}`, (err, _, stderr) => {
  if (err) {
    console.error(stderr)
    exit(1);
  }
});

exec(`g++ ${cppSourcePath} -I/usr/local/include/jscompiler -std=c++2b -o ${cli_args.output}`, (err, _, stderr) => {
  if (err) {
    console.error(stderr)
    exit(1);
  }
});
