"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const chokidar = require("chokidar");
const shell = require("shelljs");
const util = require("util");
class ProgramActions {
    /**
     * 校验cmd命令合法性
     * @param {string} cmd
     */
    static validateCmd(cmd) {
        assert(!!cmd, '"cmd" cannot be null or empty');
    }
    /**
     * 校验配置路径合法性
     * @param {string} config
     */
    static validateConfig(config) {
        // assert(fs.existsSync(config), `config file is not exist, config = ${config}`);
    }
    /**
     * 校验watch mode合法性
     */
    static validateWatchMode(watchMode) {
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
    static normalizeConfig(config) {
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
    static normalizeWatchMode(watchMode) {
        if (util.isString(watchMode)) {
            watchMode = watchMode.split('|').map((str) => str.trim()).filter(Boolean);
        }
        if (util.isArray(watchMode)) {
            return watchMode.map((mode) => mode.toLowerCase());
        }
        else {
            assert(false, `watch mode type is invalid, watchMode = ${Object.prototype.toString.call(watchMode)}`);
        }
    }
    /**
     * 监听并触发
     * @param {string} file
     * @param {string} cmd
     * @param {string[]} watchMode
     */
    static watchAndTrigger(file, cmd, watchMode) {
        chokidar.watch(file, { ignoreInitial: true, usePolling: true }).on('all', (event, path) => {
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
    start({ cmd, config, watchMode = ['add', 'change'] }) {
        ProgramActions.validateCmd(cmd);
        config = ProgramActions.normalizeConfig(config);
        watchMode = ProgramActions.normalizeWatchMode(watchMode);
        ProgramActions.validateWatchMode(watchMode);
        ProgramActions.validateConfig(config);
        ProgramActions.watchAndTrigger(config, cmd, watchMode);
    }
}
/**
 * watch mode 合法范围
 * @type {string[]}
 */
ProgramActions.VALID_WATCH_MODE = ['add', 'change', 'unlink'];
const programActions = new ProgramActions();
exports.default = programActions;
//# sourceMappingURL=index.js.map