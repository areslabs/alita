const path = require('path')

module.exports = {
    name: "HelloWorldRN",

    entry: "./src/index.js",
    output: "./wx-dist",

    include:[
        path.resolve('src'),
        path.resolve('node_modules', '@areslabs', 'hello-rn')
    ],

    resolve: {
        alias: {
            "@areslabs/stringutil-rn": "@areslabs/stringutil-wx",
        }
    },


    componentPaths: {
        "TestPath": "/src/TestPath.js"
    }
}