import test from "node:test";
import assert from "node:assert";
import { execSync } from "node:child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const test_dir = dirname(fileURLToPath(import.meta.url));
const compiler_exe = "jsc";
const compiled_exe = "./prog.out";

function test_file(inputFile) {
    try {
        // Compile
        execSync(`${compiler_exe} -d ${inputFile} -o ${compiled_exe}`, { cwd: test_dir });
    } catch {
        return 1;
    }
    try {
        // Run executable
        execSync(compiled_exe, { cwd: test_dir });
    } catch {
        return 2;
    }
    return 0;
}

function test_file_stdout(inputFile) {
    let out = "";
    try {
        // Compile
        execSync(`${compiler_exe} -d ${inputFile} -o ${compiled_exe}`, { cwd: test_dir });
    } catch {
        return [1, out];
    }
    try {
        // Run executable
        out = execSync(compiled_exe, { cwd: test_dir }).toString();
        // console.warn(`"${out.replace(/\n/g, "\\n")}"`);
    } catch {
        return [2, out];
    }
    return [0, out];
}

test("Variable declaration", async (t) => {
    // await t.test('var', (t) => {
    //     assert.strictEqual(1, 1);
    // });

    await t.test("let", () => {
        assert.strictEqual(0, test_file("./sources/let.js"));
    });

    await t.test("const", () => {
        assert.strictEqual(0, test_file("./sources/const.js"));
    });
});

test("Loop", async (t) => {
    await t.test("for", () => {
        assert.strictEqual(0, test_file("./sources/loop/for.js"));
    });
    await t.test("for_of", () => {
        assert.strictEqual(0, test_file("./sources/loop/for_of.js"));
    });
    await t.test("for_in", () => {
        assert.strictEqual(0, test_file("./sources/loop/for_in.js"));
    });
    await t.test("while", () => {
        assert.strictEqual(0, test_file("./sources/loop/while.js"));
    });
    await t.test("do_while", () => {
        assert.strictEqual(0, test_file("./sources/loop/do_while.js"));
    });
});

test("typeof", async () => {
    const [status, out] = test_file_stdout("./sources/typeof.js");
    assert.strictEqual(0, status);
    assert.strictEqual(
        // "number\nnumber\nstring\nstring\nnumber\nnumber (integer)\nnumber\nnumber (float)\nboolean\nboolean\nobject (array)\narray\nobject\nobject\nobject\nobject (NULL)\nundefined\nundefined\nundefined\n",  // for debug build
        "number\nnumber\nstring\nstring\nnumber\nnumber\nnumber\nnumber\nboolean\nboolean\nobject\nobject\nobject\nobject\nobject\nobject\nundefined\nundefined\nundefined\n",
        out
    );
});

test("math", async () => {
    const [status, out] = test_file_stdout("./sources/math.js");
    assert.strictEqual(0, status);
    assert.strictEqual(
        // "1232.4number (float)\n1232.4number (float)\n1232number (float)\n5656\n", // for debug
        "1232.4number\n1232.4number\n1232number\n5656\n",
        out
    );
});

test("Array", async () => {
    assert.strictEqual(0, test_file("./sources/array.js"));
});

test("Function", async (t) => {
    await t.test("function_statement", () => {
        assert.strictEqual(0, test_file("./sources/function/function_statement.js"));
    });
    await t.test("function_expression", () => {
        assert.strictEqual(0, test_file("./sources/function/function_expression.js"));
    });
    await t.test("function_expression_named", () => {
        assert.strictEqual(0, test_file("./sources/function/function_expression_named.js"));
    });
    await t.test("function_expression_lambda", () => {
        assert.strictEqual(0, test_file("./sources/function/function_expression_lambda.js"));
    });
    await t.test("function_statement_global_captures", () => {
        assert.strictEqual(0, test_file("./sources/function/function_statement_global_captures.js"));
    });
    await t.test("function_expression_global_captures", () => {
        assert.strictEqual(0, test_file("./sources/function/function_expression_global_captures.js"));
    });
    await t.test("function_statement_local_captures", () => {
        assert.strictEqual(0, test_file("./sources/function/function_statement_local_captures.js"));
    });
    await t.test("function_expression_local_captures", () => {
        assert.strictEqual(0, test_file("./sources/function/function_expression_local_captures.js"));
    });
});

test("console", async () => {
    assert.strictEqual(0, test_file("./sources/console.js"));
});

test("import", async (t) => {
    await t.test("simple_import", () => {
        assert.strictEqual(0, test_file("./sources/import/import.js"));  // depends on export.js
    });
    await t.test("folder_import", () => {
        assert.strictEqual(0, test_file("./sources/import/import2.js"));  // depends on export/export.js
    });
});
