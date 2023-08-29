import { Canvas } from '../Canvas'
import { ImagePath } from '../elements/Image'

export class AddImage {
    static add(imageFile: File, elementsCanvas: Canvas, x: number, y: number) {
        if (!imageFile.type.startsWith('image/')) return
        const image = new ImagePath(imageFile, x, y)
        image.offset.x = elementsCanvas.offset.x
        image.offset.y = elementsCanvas.offset.y
        image.load().then((path) => {
            elementsCanvas.addPath(path)
        })
    }
}
