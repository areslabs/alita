module.exports = {
    name: "ReactRepos",

    entry: "./RNApp.js",
    output: "./wx-dist",

    resolve: {
        // for npm link /yarn link
        symlinks: false
    },
}