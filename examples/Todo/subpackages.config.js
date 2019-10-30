module.exports = {
    subDir: '/pages/Todo',

    isFileIgnore: path => {
        if (path.startsWith('.')) return true
    },
}