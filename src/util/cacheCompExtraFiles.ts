
const cacheGeneFiles: any = {}

export function setFiles(filepath, files) {
    cacheGeneFiles[filepath] = files
}

export function getFiles(filepath) : Set<string> {
    return cacheGeneFiles[filepath]
}