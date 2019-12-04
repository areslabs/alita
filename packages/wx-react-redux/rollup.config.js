const babel = require('rollup-plugin-babel')

export default {
    input: 'src/index.js',

    output: [
        { file: "dist/index.js", format: "cjs" },
    ],

    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env'],
            runtimeHelpers: true,
            plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime'
            ]
        })
    ],

    external: ['@areslabs/wx-react', '@areslabs/wx-react-native', 'redux']
};