import { Element, ElementProperties } from './Element'

export class ImageElement extends Element {
    constructor(
        private image: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    static async load(
        imageFile: File,
        centerX: number,
        centerY: number,
        elementProperties?: ElementProperties
    ) {
        if (!imageFile.type.startsWith('image/'))
            throw new Error('File is not an image')

        const image = new Image()
        image.src = URL.createObjectURL(imageFile)
        await image.decode()
        URL.revokeObjectURL(image.src)
        const width = image.naturalWidth
        const height = image.naturalHeight
        const x = Math.round(centerX - width / 2)
        const y = Math.round(centerY - height / 2)
        return new ImageElement(image, x, y, width, height, elementProperties)
    }

    clone() {
        return new ImageElement(
            this.image,
            this.x,
            this.y,
            this.width,
            this.height,
            this
        )
    }
}
