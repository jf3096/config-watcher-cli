#!/usr/bin/env node
import * as program from 'commander';
import * as pkg from '../package.json';
import programActions from '../src/bin';

program
  .version(pkg.version)
  .option('-c, --config <value>', 'config file path')
  .option('-C, --cmd <value>', 'if any changes from config file can trigger current cmd')
  .option('-w, --watch-mode [value]', 'watch file mode [add, change, unlink], default: add and change')
  .parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
} else {
  const {cmd, config, watchMode} = program;
  programActions.start({cmd, config, watchMode});
}
