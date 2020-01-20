
interface IImageInfos {
    usedImages: Set<string>

    outFiles: {
        [key: string]: string
    }
}

const imageInfos = {
    usedImages: new Set<string>(),
    outFiles: {}
} as IImageInfos

export function addUsedImage(imagePath) {
    imageInfos.usedImages.add(imagePath)
}

export function resetUsedImages() {
    imageInfos.usedImages = new Set<string>()
}


export function getImageInfos() {
    return imageInfos
}

