module.exports = {
    parser: 'babel-eslint',
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        node: true,
    },

    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },

    globals: {
        // 微信全局变量Component, wx, requirePlugin
        Component: false,
        wx: false,
        requirePlugin: false,
    },

    extends: "eslint:recommended",

    rules: {
        "no-console": 0,
        "no-unused-vars": 1,
    }
}