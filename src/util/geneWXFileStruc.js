/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import path from 'path'
import fse from 'fs-extra'

export default function geneWXFileStruc(targetpath, tranComp) {
    const mptempDir = path.resolve(__dirname, '..', '..', 'mptemp')
    fse.copySync(mptempDir, targetpath)


    const pcjPath = path.resolve(targetpath, 'project.config.json')
    if (fse.existsSync(pcjPath)) {
        // 不要覆盖已有project.config.json， 因为开发者可能手动修改过这个文件
        return
    }

    if (tranComp) {
        // 转化组件，不需要project.config.json 文件
        return
    }


    // 生成 project.config.json 文件
    const {name, appid} = global.execArgs.configObj
    const pcjStr = `{
	"description": "项目配置文件。",
	"packOptions": {
		"ignore": []
	},
	"setting": {
		"urlCheck": false,
		"es6": true,
		"postcss": true,
		"minified": true,
		"newFeature": true,
		"nodeModules": true
	},
	"compileType": "miniprogram",
	"libVersion": "",
	"appid": "${appid}",
	"projectname": "${name}",
	"isGameTourist": false,
	"condition": {
		"search": {
			"current": -1,
			"list": []
		},
		"conversation": {
			"current": -1,
			"list": []
		},
		"game": {
			"currentL": -1,
			"list": []
		},
		"miniprogram": {
			"current": -1,
			"list": []
		}
	}
}
    `



    fse.outputFileSync(pcjPath, pcjStr)
}
