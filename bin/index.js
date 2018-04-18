#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const pkg = require("../package.json");
const bin_1 = require("../src/bin");
program
    .version(pkg.version)
    .option('-c, --config <value>', 'config file path')
    .option('-C, --cmd <value>', 'if any changes from config file can trigger current cmd')
    .parse(process.argv);
if (process.argv.length === 2) {
    program.outputHelp();
}
else {
    const { cmd, config } = program;
    bin_1.default.start({ cmd, config });
}
//# sourceMappingURL=index.js.map