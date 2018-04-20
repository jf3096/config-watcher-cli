import * as assert from 'assert';
import * as path from 'path';
import * as chokidar from 'chokidar';
import * as shell from 'shelljs';
import * as util from 'util';

class ProgramActions {

  /**
   * watch mode 合法范围
   * @type {string[]}
   */
  private static VALID_WATCH_MODE = ['add', 'change', 'unlink'];

  /**
   * 校验cmd命令合法性
   * @param {string} cmd
   */
  private static validateCmd(cmd: string): void {
    assert(!!cmd, '"cmd" cannot be null or empty');
  }

  /**
   * 校验配置路径合法性
   * @param {string} config
   */
  private static validateConfig(config: string): void {
    // assert(fs.existsSync(config), `config file is not exist, config = ${config}`);
  }

  /**
   * 校验watch mode合法性
   */
  private static validateWatchMode(watchMode: string[]): void {
    assert(watchMode, 'watch mode cannot be empty');
    assert(Array.isArray(watchMode), 'watch mode must be array type');
    const invalidWatchMode = watchMode.filter((mode) => ProgramActions.VALID_WATCH_MODE.indexOf(mode) === -1);
    assert(!invalidWatchMode.length, `found invalid watch mode = ${invalidWatchMode}`);
  }

  /**
   * 标准化配置路径, 允许传入相对路径, 但最终会转换成统一的绝对路径进行后续处理
   * @param {string} config
   * @return {string}
   */
  private static normalizeConfig(config: string): string {
    /**
     * 判断是如果不是绝对路径
     */
    if (!path.isAbsolute(config)) {
      /**
       * 默认情况下拼接工作路径生成新的绝对路径
       * @type {string}
       */
      config = path.join(process.cwd(), config);
    }
    return config;
  }

  /**
   * 标准化watch mode, 允许输入 'change | add | unlink'
   */
  private static normalizeWatchMode(watchMode: string | string[]): string[] | void {
    if (util.isString(watchMode)) {
      watchMode = watchMode.split('|').map((str: string) => str.trim()).filter(Boolean);
    }
    if (util.isArray(watchMode)) {
      return watchMode.map((mode) => mode.toLowerCase());
    } else {
      assert(false, `watch mode type is invalid, watchMode = ${Object.prototype.toString.call(watchMode)}`);
    }
  }

  /**
   * 监听并触发
   * @param {string} file
   * @param {string} cmd
   * @param {string[]} watchMode
   */
  private static watchAndTrigger(file: string, cmd: string, watchMode: string[]): void {
    chokidar.watch(file, {ignoreInitial: true, usePolling: true}).on('all', (event: string, path: string) => {
      /**
       * 指定 watch mode 时触发, 一般情况 watch mode = ['add', 'change', 'unlink'], 其中unlink表示移除
       */
      if (watchMode.indexOf(event) > -1) {
        /* tslint:disable */
        console.log(`[${new Date()}]: File ${path} has been ${event}`);
        /* tslint:enable */
        if (shell.exec(cmd).code !== 0) {
          shell.echo('Error: command failed');
          shell.exit(1);
        }
      }
    });
  }

  public start({cmd, config, watchMode = ['add', 'change']}: { cmd: string, config: string, watchMode: string }): void {
    ProgramActions.validateCmd(cmd);
    config = ProgramActions.normalizeConfig(config);
    watchMode = ProgramActions.normalizeWatchMode(watchMode) as string[];
    ProgramActions.validateWatchMode(watchMode);
    ProgramActions.validateConfig(config);
    ProgramActions.watchAndTrigger(config, cmd, watchMode);
  }
}

const programActions = new ProgramActions();
export default programActions;
