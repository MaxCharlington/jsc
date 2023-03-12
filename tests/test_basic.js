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

test("Variable declaration", async (t) => {
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

test("Loop", async (t) => {
    await t.test("for", () => {
        assert.strictEqual(0, test_with_file("./sources/loop/for.js"));
    });
    await t.test("for_of", () => {
        assert.strictEqual(0, test_with_file("./sources/loop/for_of.js"));
    });
    // await t.test("for_in", () => {
    //     assert.strictEqual(0, test_with_file("./sources/loop/for_in.js"));
    // });
    await t.test("while", () => {
        assert.strictEqual(0, test_with_file("./sources/loop/while.js"));
    });
    await t.test("do_while", () => {
        assert.strictEqual(0, test_with_file("./sources/loop/do_while.js"));
    });
});

test("Array", async () => {
    assert.strictEqual(0, test_with_file("./sources/array.js"));
});

test("Function", async (t) => {
    await t.test("function_statement", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_statement.js"));
    });
    await t.test("function_expression", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_expression.js"));
    });
    await t.test("function_expression_named", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_expression_named.js"));
    });
    await t.test("function_expression_lambda", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_expression_lambda.js"));
    });
    await t.test("function_statement_global_captures", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_statement_global_captures.js"));
    });
    await t.test("function_expression_global_captures", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_expression_global_captures.js"));
    });
    await t.test("function_statement_local_captures", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_statement_local_captures.js"));
    });
    await t.test("function_expression_local_captures", () => {
        assert.strictEqual(0, test_with_file("./sources/function/function_expression_local_captures.js"));
    });
});

test("console", async () => {
    assert.strictEqual(0, test_with_file("./sources/console.js"));
});
