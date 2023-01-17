#!/usr/bin/env node

const { exit } = require('process');
const acorn = require("acorn");
const fs = require('fs');

const args = process.argv.slice(2);
const path_to_js = args[0];
const path_to_out_json = args[1];

let source;
try
{
    source = fs.readFileSync(path_to_js, 'utf8');
}
catch (err)
{
    console.error(err);
    exit(1);
}

const tree = acorn.parse(
    source,
    {
        ecmaVersion: 6,
        sourceType: "script",
        locations: true
    }
);

try
{
    fs.writeFileSync(path_to_out_json, JSON.stringify(tree, null, 4));
}
catch (err)
{
    console.error(err);
    exit(1);
}
