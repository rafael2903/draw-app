import { Path, PathOptions } from './Path'

export class ImagePath extends Path {
    readonly imageElement: HTMLImageElement
    constructor(
        imageFile: File,
        private centerX: number,
        private centerY: number,
        pathOptions?: PathOptions
    ) {
        if (!imageFile.type.startsWith('image/'))
            throw new Error('File is not an image')
        super(pathOptions)
        this.imageElement = new Image()
        this.imageElement.src = URL.createObjectURL(imageFile)
    }

    async load() {
        await this.imageElement.decode()
        this.width ||= this.imageElement.naturalWidth
        this.height ||= this.imageElement.naturalHeight
        this.x = Math.round(this.centerX - this.width / 2)
        this.y = Math.round(this.centerY - this.height / 2)
        URL.revokeObjectURL(this.imageElement.src)
        return this
    }
}
