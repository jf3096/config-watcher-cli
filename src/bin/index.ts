import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as shell from 'shelljs';

class ProgramActions {

  private static validateCmd(cmd: string): void {
    assert(!!cmd, '"cmd" cannot be null or empty');
  }

  private static validateConfig(config: string): void {
    assert(fs.existsSync(config), `config file is not exist, config = ${config}`);
  }

  private static normalizeConfig(config: string): string {
    if (!path.isAbsolute(config)) {
      config = path.join(process.cwd(), config);
    }
    return config;
  }

  private static watchAndTrigger(file: string, cmd: string): void {
    chokidar.watch(file).on('change', (path: string) => {
      /* tslint:disable */
      console.log(`[${new Date()}]: File ${path} has been changed`);
      /* tslint:enable */
      if (shell.exec(cmd).code !== 0) {
        shell.echo('Error: command failed');
        shell.exit(1);
      }
    });
  }

  public start({cmd, config}: { cmd: string, config: string }): void {
    ProgramActions.validateCmd(cmd);
    config = ProgramActions.normalizeConfig(config);
    ProgramActions.validateConfig(config);
    ProgramActions.watchAndTrigger(config, cmd);
  }
}

const programActions = new ProgramActions();
export default programActions;
