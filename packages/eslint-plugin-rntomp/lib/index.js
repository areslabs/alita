/**
 * @fileoverview React Native ===&gt; miniprogram
 * @author yankang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const fs = require('fs')
const requireIndex = require("requireindex");
const config = require("eslint-config-react-app")

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

let allRules = requireIndex(__dirname + "/rules");
onlyCheckWxFile(allRules)


module.exports = {
    rules: allRules,
    configs: {
        all: {
            ...config,
            plugins: [
                '@areslabs/rntomp'
            ],
            rules: {
                "no-undef": 2,
                "no-implicit-globals": 2,
                "no-eval": 2,
                "no-implied-eval": 2,
                "no-extend-native": 2,
                "no-global-assign": 2,

                // rntomp rules
                ...(getRules([
                    'component-static-path',
                    'no-as-in-rncomponent',
                    'no-direct-children',
                    'no-direct-xxcomponent',
                    'no-global',
                    'no-h',
                    'no-jsxelement-inhoc',
                    'no-jsxspreadattribute-basecomponent',
                    'no-member-jsxelement',
                    'no-rn-animated',
                    'no-webview',
                    'not-support-api',
                    'not-support-component',
                    'not-support-jsxattributes',
                    'one-file-one-component',
                    'wx-hoc'
                ], 2))
            }
        }
    }

}

function getRules(rules, level) {
    const r = {}
    rules.forEach(rule => {
        r[`@areslabs/rntomp/${rule}`] =  level
    })
    return r
}


// 减少同步检查文件的次数
const wxfileExistMap = {}

// 只检查微信小程序相关文件
function onlyCheckWxFile(allRules) {
    const allRuleKeys = Object.keys(allRules)
    allRuleKeys.forEach(key => {
        const rule = allRules[key]
        const rawCreate = rule.create
        rule.create = function (context) {
            const filepath = context.getFilename()
            const wxFilepath = filepath.replace('.js', '.wx.js')


            if (wxfileExistMap[filepath] === undefined) {
                if (fs.existsSync(wxFilepath)) {
                    wxfileExistMap[filepath] = true
                } else {
                    wxfileExistMap[filepath] = false
                }
            }


            if (wxfileExistMap[filepath] === true) {
                return {}
            }

            return rawCreate(context)
        }
    })
}



