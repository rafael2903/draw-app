import { Canvas } from '../Canvas'
import { ImageElement } from '../elements'
import { canvasHistory } from '../main'

export class AddImage {
    static add(imageFile: File, elementsCanvas: Canvas, x: number, y: number) {
        if (!imageFile.type.startsWith('image/')) return

        const image = new ImageElement(imageFile, x, y)

        image.load().then((element) => {
            elementsCanvas.addElement(element)
            canvasHistory.save()
        })
    }
}
