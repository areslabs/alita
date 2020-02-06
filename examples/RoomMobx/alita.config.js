module.exports = {
    name: "RoomMobx",

    entry: "./RNApp.js",
    output: "./wx-dist",

    resolve: {
        // for npm link /yarn link
        symlinks: false
    },
}