/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import path from 'path'
import fse from 'fs-extra'

/**
 * 生成微信小程序package.json
 */
export default function geneWXPackageJSON() {
    const {
        INPUT_DIR,
        configObj,
        OUT_DIR,
        tranComp
    } = global.execArgs

    let packagePath = OUT_DIR
    if (tranComp) {
        // package.json 和miniprogram_npm 同级
        packagePath = path.resolve(OUT_DIR, "..")
    }


    const packJSONPath = path.resolve(INPUT_DIR, configObj.packageJSONPath)
    console.log('package.json路径：'.info, packJSONPath)
    if (fse.existsSync(packJSONPath)) {
        const pack = JSON.parse(fse.readFileSync(packJSONPath).toString())
        const newPack = {}
        if (!pack.name) {
            console.log('package.json文件缺少name字段'.warn)
        }
        newPack.name = pack.name
        newPack.version = pack.version || '1.0.0'

        global.execArgs.packageName = pack.name || ''

        const allDepKeys = Object.keys(pack.dependencies || {})
        const newDep = {}
        allDepKeys.forEach(depKey => {
            if (configObj.dependenciesMap[depKey] === false) {
                // remove
            } else if (configObj.dependenciesMap[depKey] !== undefined) {
                const newDepValue = configObj.dependenciesMap[depKey]

                if (typeof newDepValue === 'string') {
                    newDep[newDepValue] = pack.dependencies[depKey]
                } else {
                    const [name, version] = newDepValue
                    newDep[name] = version
                }
            }  else {
                newDep[depKey] = pack.dependencies[depKey]
            }
        })
        newPack.dependencies = newDep
        fse.writeFileSync(
            path.resolve(packagePath, 'package.json'),
            JSON.stringify(newPack, null, '\t'),
        )
    } else {
        console.log('请在配置文件指定正确的package.json路径'.error)
        process.exit()
    }

}