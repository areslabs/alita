const path = require('path')

module.exports = {
    name: "HelloWorldExpo",

    entry: "./src/index.js",
    output: "./wx-dist",

    include:[
        path.resolve('src'),
        path.resolve('node_modules', '@areslabs', 'hello-rn')
    ],

    resolve: {
        // for npm link /yarn link
        symlinks: false
    },
}