import { Canvas } from '../Canvas'
import { ImageElement } from '../elements'

export class AddImage {
    static add(imageFile: File, elementsCanvas: Canvas, x: number, y: number) {
        if (!imageFile.type.startsWith('image/')) return

        ImageElement.load(imageFile, x, y).then((element) => {
            elementsCanvas.addElement(element)
        })
    }
}
