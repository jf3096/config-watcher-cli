"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const shell = require("shelljs");
class ProgramActions {
    static validateCmd(cmd) {
        assert(!!cmd, '"cmd" cannot be null or empty');
    }
    static validateConfig(config) {
        assert(fs.existsSync(config), `config file is not exist, config = ${config}`);
    }
    static normalizeConfig(config) {
        if (!path.isAbsolute(config)) {
            config = path.join(process.cwd(), config);
        }
        return config;
    }
    static watchAndTrigger(file, cmd) {
        chokidar.watch(file).on('change', (path) => {
            /* tslint:disable */
            console.log(`[${new Date()}]: File ${path} has been changed`);
            /* tslint:enable */
            if (shell.exec(cmd).code !== 0) {
                shell.echo('Error: command failed');
                shell.exit(1);
            }
        });
    }
    start({ cmd, config }) {
        ProgramActions.validateCmd(cmd);
        config = ProgramActions.normalizeConfig(config);
        ProgramActions.validateConfig(config);
        ProgramActions.watchAndTrigger(config, cmd);
    }
}
const programActions = new ProgramActions();
exports.default = programActions;
//# sourceMappingURL=index.js.map