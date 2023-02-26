import test from "node:test";
import assert from "node:assert";
import { execSync } from "node:child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const test_dir = dirname(fileURLToPath(import.meta.url));

function test_with_file(inputFile) {
    const exe_name = "./prog.out";
    try {
        // Compile
        execSync(`node ../index.js -d ${inputFile} -o ${exe_name}`, { cwd: test_dir });
    } catch {
        return 1;
    }
    try {
        // Run executable
        execSync(exe_name, { cwd: test_dir });
    } catch {
        return 1;
    }
    return 0;
}

test("Variable declaration", async () => {
    // await t.test('var', (t) => {
    //     assert.strictEqual(1, 1);
    // });

    await t.test("let", () => {
        assert.strictEqual(0, test_with_file("./sources/let.js"));
    });

    await t.test("const", () => {
        assert.strictEqual(0, test_with_file("./sources/const.js"));
    });
});

test("Array", async (t) => {
    assert.strictEqual(0, test_with_file("./sources/array.js"));
});

test("Function declaration", async (t) => {
    await t.test("function", () => {
        assert.strictEqual(0, test_with_file("./sources/function.js"));
    });
});
