import { exec } from "node:child_process";
import { once } from "events";
import { exit } from "process";
import path from "node:path";
import { ReadStream, WriteStream } from "node:fs";
import { Buffer } from "node:buffer";

export async function readFullStream(stream: ReadStream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

export async function outputFullStream(stream: WriteStream | any, data: string) {
    for (let i = 0; i < data.length;) {
        const flushed = stream.write(data.slice(i, i += stream.writableHighWaterMark));
        if (!flushed) {
            await once(stream, "drain");
        }
    }
    stream.end();
}

export function format_cpp(cppSourcePath: string) {
    exec(`clang-format ${cppSourcePath} > ${path.join(path.dirname(cppSourcePath), path.basename(cppSourcePath, ".cpp") + ".formatted.cpp")}`, (err, _, stderr) => {
        if (err) {
            console.error(stderr);
        }
    });
}

export function compile_cpp(cppSourcePath: string, outPath: string) {
    exec(`g++-13 ${cppSourcePath} -I/usr/local/include/jscompiler -std=c++23 -o ${outPath}`, (err, _, stderr) => {
        if (err) {
            console.error(stderr);
            exit(1);
        }
    });
}
