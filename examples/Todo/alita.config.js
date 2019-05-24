module.exports = {
    isFileIgnore: path => {
        if (path.startsWith('.')) return true
    },

    dependenciesMap: {},
}