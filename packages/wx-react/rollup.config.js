const babel = require('rollup-plugin-babel')

export default {
    input: 'src/index.js',

    output: [
        { file: "dist/index.js", format: "cjs" },
    ],

    plugins: [
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-transform-runtime"]
        })
    ]
};