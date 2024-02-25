import { Canvas } from '../Canvas'

export class ExportCanvasService {
    static download(canvas: Canvas, type = 'image/jpeg') {
        const link = document.createElement('a')
        link.href = canvas.toImageURL(type, 1.0)
        link.download = 'picture'
        link.click()
    }
}
