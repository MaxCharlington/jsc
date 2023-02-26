import { exec } from "node:child_process";
import { once } from "events";
import { exit } from "process";
import path from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const run_dir = path.join(dirname(fileURLToPath(import.meta.url)), "..");

export async function readFullStream(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

export async function outputFullStream(stream, data) {
    for (let i = 0; i < data.length;) {
        const flushed = stream.write(data.slice(i, i += stream.writableHighWaterMark));
        if (!flushed) {
            await once(stream, "drain");
        }
    }
    stream.end();
}

export function format_cpp(cppSourcePath) {
    exec(`${run_dir}/node_modules/clang-format/bin/linux_x64/clang-format ${cppSourcePath} > ${path.join(path.dirname(cppSourcePath), path.basename(cppSourcePath, ".cpp") + ".formatted.cpp")}`, (err, _, stderr) => {
        if (err) {
            console.error(stderr);
        }
    });
}

export function compile_cpp(cppSourcePath, outPath) {
    exec(`g++ ${cppSourcePath} -I/usr/local/include/jscompiler -std=c++2b -o ${outPath}`, (err, _, stderr) => {
        if (err) {
            console.error(stderr);
            exit(1);
        }
    });
}
