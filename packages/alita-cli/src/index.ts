#!/usr/bin/env node
/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as path from 'path'
import getopts from 'getopts'
import chalk from 'chalk'

import initProject from './initProject'

const packz = require('../package.json')


const ALITA_CORE_INDEX_PATH = function() {
    return path.resolve(
        process.cwd(),
        'node_modules',
        '@areslabs',
        'alita-core',
        'lib',
        'index'
    );
};

const options = getopts(process.argv, {
    alias: {
        w: 'watch',
        v: 'version',
        config: 'config',
        dev: 'dev',

        // use with init
        typescript: 'typescript',

        analyzer: 'analyzer'
    },
})


if (options.version) {
    console.log(packz.version)
} else if (options._.includes('init')) {
    initProject(options._, options.typescript)
} else {
    try {
        require(ALITA_CORE_INDEX_PATH())
    } catch (e) {
        console.log(chalk.red('请确认目录无误！'))
        console.log(e)
    }
}
