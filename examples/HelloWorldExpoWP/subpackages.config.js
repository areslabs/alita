module.exports = {
    subDir: "/pages/HelloWorld",
    dependenciesMap: {
        expo: false,
        "@areslabs/hi-rn": "@areslabs/hi-wx",
        "@areslabs/hello-rn": "@areslabs/hello-wx"
    },
    extCompLibs: [
        {
            name: "@areslabs/hi-rn",
            compLists: ["Hi"]
        }
    ]
}
