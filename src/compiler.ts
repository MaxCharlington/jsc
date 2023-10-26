import { exec, execSync } from "node:child_process";
import { once } from "events";
import { exit } from "process";
import { ReadStream, WriteStream } from "node:fs";
import { Buffer } from "node:buffer";
import path from "node:path";

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

const CXX = "g++-13";
const CXX_FLAGS = "-std=c++23 -O3";

export async function compile_cpp(cppSourcePath: string, outPath: string) {
    try {
        // Workaround to get include paths from proxy script
        // TODO: implement fully in terms of import.meta.dir when bun fixes bundle issue
        let libIncludeDir;
        if (process.env.INCLUDE_DIR !== undefined)
        {
            libIncludeDir = process.env.INCLUDE_DIR;
            throw new Error("Include path env var undefined");
        }
        else
        {
            // Case for debugging without building
            //@ts-ignore
            libIncludeDir = path.join(import.meta.dir, "library");
        }
        const helpersIncludeDir = path.join(libIncludeDir, "..", "..", "deps", "helpers");
        execSync(`${CXX} ${cppSourcePath} -I ${libIncludeDir} -I ${helpersIncludeDir} ${CXX_FLAGS} -o ${outPath}`);
    } catch (e: any) {
        console.error("Compile error:\n", e?.stderr?.toString() || `${e.name}:\n${e.message}`);
        exit(1);
    }
}
