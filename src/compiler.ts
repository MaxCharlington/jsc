import { exec, execSync } from "node:child_process";
import { once } from "events";
import { exit } from "process";
import path, { dirname } from "node:path";
import { ReadStream, WriteStream } from "node:fs";
import { Buffer } from "node:buffer";
import { findUp } from "find-up";

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

async function libraryHeaderDirGetWorkaround(): Promise<string> {
    // Workaround as Bun cannot get current executabe path
    const pathToNearestPackageJson = await findUp("package.json");
    if (pathToNearestPackageJson === undefined) {
        throw new Error("Unable to find package.json in parent directory. Cannot resolve c++ library path");
    }
    const jscLibraryHeaderPathDir = path.join(dirname(pathToNearestPackageJson), "node_modules", "jsc", "dist");
    return jscLibraryHeaderPathDir;
}

export async function compile_cpp(cppSourcePath: string, outPath: string) {
    try {
        // Compile
        execSync(`${CXX} ${cppSourcePath} -I ${await libraryHeaderDirGetWorkaround()} ${CXX_FLAGS} -o ${outPath}`);
    } catch (e: any) {
        console.error(e.stderr.toString());
        exit(1);
    }
}
