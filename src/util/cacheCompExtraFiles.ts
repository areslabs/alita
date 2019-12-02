/**
 * 缓存 jsx/tsx 生成文件数组，方便watch的时候清理工作
 * @type {{}}
 */

const cacheGeneFiles: any = {}

export function setFiles(filepath, files) {
    cacheGeneFiles[filepath] = files
}

export function getFiles(filepath) : Set<string> {
    return cacheGeneFiles[filepath]
}