export class DownloadCanvasImage {
    static downloadImage(canvas: HTMLCanvasElement, fileName: string) {
        const offScreenCanvas = document.createElement('canvas')
        offScreenCanvas.width = canvas.width
        offScreenCanvas.height = canvas.height
        const offScreenCanvasContext = offScreenCanvas.getContext('2d')!

        const backgroundColor = canvas.style.backgroundColor
        offScreenCanvasContext.fillStyle = backgroundColor
        offScreenCanvasContext.fillRect(0, 0, canvas.width, canvas.height)
        offScreenCanvasContext.drawImage(canvas, 0, 0)

        const link = document.createElement('a')
        link.download = fileName
        link.href = offScreenCanvas.toDataURL('image/jpeg', 1.0)
        link.click()
    }
}
