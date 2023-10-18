import { exit } from "process";
import { promisify } from "util";
import { exec as execSync } from "child_process";
const exec = promisify(execSync);

export async function pretranspile(sourcePath: string, outPath: string) {
    try {
        await exec(`esbuild --bundle --platform=node --sourcemap=inline --charset=utf8 ${sourcePath} --outfile=${outPath}`);
    }
    catch (e)
    {
        console.error("Pretranspile step error:\n", e);
        exit(1);
    }
}
