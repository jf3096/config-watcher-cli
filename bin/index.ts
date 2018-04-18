#!/usr/bin/env node
import * as program from 'commander';
import * as pkg from '../package.json';
import programActions from '../src/bin';

program
  .version(pkg.version)
  .option('-c, --config <value>', 'config file path')
  .option('-C, --cmd <value>', 'if any changes from config file can trigger current cmd')
  .parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
} else {
  const {cmd, config} = program;
  programActions.start({cmd, config});
}
