import { Observable } from './Observable'
import { Element } from './elements'
import { Point } from './types'

interface CanvasEventMap {
    change: Element[]
    'element-added': Element
    'element-removed': Element
    'element-changed': Element
}

export class Canvas extends Observable<CanvasEventMap> {
    private ctx: CanvasRenderingContext2D
    private elements: Element[] = []
    private _translationX = 0
    private _translationY = 0
    private _scale = 1.0
    private _cursor = 'default'

    constructor(readonly element: HTMLCanvasElement) {
        super()
        this.ctx = element.getContext('2d')!
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
    }

    get isEmpty() {
        return this.elements.length === 0
    }

    get width() {
        return this.element.width
    }

    get height() {
        return this.element.height
    }

    set width(value: number) {
        this.element.width = value
        this.redraw()
    }

    set height(value: number) {
        this.element.height = value
        this.redraw()
    }

    get cursor() {
        return this._cursor
    }

    set cursor(value: string) {
        this._cursor = value
        this.element.style.cursor = value
    }

    private emitChangeEvent() {
        this.emit('change', this.elements)
    }

    private updateTransformationMatrix() {
        this.ctx.setTransform(
            this._scale,
            0,
            0,
            this._scale,
            this._translationX,
            this._translationY
        )
    }

    private erase() {
        // Use reset() instead of clearRect() to avoid bugs when resizing and scaling the canvas
        this.ctx.reset()
        this.updateTransformationMatrix()
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
    }

    lineWidth(value: number) {
        this.ctx.lineWidth = value
    }

    fillStyle(value: string) {
        this.ctx.fillStyle = value
    }

    strokeStyle(value: string) {
        this.ctx.strokeStyle = value
    }

    opacity(value: number) {
        this.ctx.globalAlpha = value
    }

    drawImage(image: HTMLImageElement, x: number, y: number) {
        this.ctx.drawImage(image, x, y)
    }

    fill(path: Path2D) {
        this.ctx.fill(path)
    }

    stroke(path: Path2D) {
        this.ctx.stroke(path)
    }

    isPointInStroke(path: Path2D, x: number, y: number) {
        return this.ctx.isPointInStroke(
            path,
            x + this.translationX,
            y + this.translationY
        )
    }

    isPointInPath(path: Path2D, x: number, y: number) {
        return this.ctx.isPointInPath(
            path,
            x + this.translationX,
            y + this.translationY
        )
    }

    private drawElements() {
        this.elements.forEach((element) => element.draw(this))
    }

    private redraw() {
        this.erase()
        this.drawElements()
    }

    replaceElements(...newElements: Element[]) {
        this.elements.forEach((element) => {
            element.off('change', this.onElementChange)
        })
        newElements.forEach((element) => {
            element.on('change', this.onElementChange)
        })
        this.elements.splice(0, Infinity, ...newElements)
        this.redraw()
        this.emitChangeEvent()
    }

    removeAll() {
        this.replaceElements()
    }

    private onElementChange = (element: Element) => {
        this.redraw()
        this.emitChangeEvent()
        this.emit('element-changed', element)
    }

    addElement(element: Element) {
        this.elements.push(element)
        element.draw(this)
        element.on('change', this.onElementChange)
        this.emitChangeEvent()
        this.emit('element-added', element)
    }

    removeElementsByIndex(...elementsIndexes: number[]) {
        const removedElements: Element[] = []
        elementsIndexes.forEach((index) => {
            const element = this.elements[index]
            element.off('change', this.onElementChange)
            this.elements.splice(index, 1)
            this.emit('element-removed', element)
            removedElements.push(element)
        })
        this.redraw()
        this.emitChangeEvent()
        return removedElements
    }

    removeElement(element: Element) {
        const elementIndex = this.elements.indexOf(element)
        if (elementIndex !== -1) {
            return this.removeElementsByIndex(elementIndex)[0]
        }
    }

    removeElements(elements: Element[]) {
        return elements.map((element) => this.removeElement(element))
    }

    removeElementAtPoint(x: number, y: number) {
        const elementToRemoveIndex = this.elements.findLastIndex((element) => {
            return element.containsPoint(x, y, this)
        })

        if (elementToRemoveIndex !== -1) {
            return this.removeElementsByIndex(elementToRemoveIndex)[0]
        }
    }

    getElementAtPoint(x: number, y: number) {
        return this.getElementsAtPoint(x, y).at(-1)
    }

    getElementsAtPoint(x: number, y: number) {
        return this.elements.filter((element) => {
            return element.containsPoint(x, y, this)
        })
    }

    getElementsInBox(x: number, y: number, width: number, height: number) {
        return this.elements.filter((element) => {
            return (
                element.x >= x &&
                element.x + element.width <= x + width &&
                element.y >= y &&
                element.y + element.height <= y + height
            )
        })
    }

    translate(x: number, y: number) {
        this._translationX += x
        this._translationY += y
        this.redraw()
    }

    setTranslation(x: number, y: number) {
        this._translationX = x
        this._translationY = y
        this.redraw()
    }

    get translationX() {
        return this._translationX
    }

    get translationY() {
        return this._translationY
    }

    getTranslatedPoint(x: number, y: number) {
        return new Point(x - this._translationX, y - this._translationY)
    }

    get centerX() {
        return this.width / 2 - this.translationX
    }

    get centerY() {
        return this.height / 2 - this.translationY
    }

    setScale(newScale: number) {
        this._scale = newScale
        this.redraw()
        return this._scale
    }

    scale(scaleAmount: number) {
        const newScale = this._scale + scaleAmount
        return this.setScale(newScale)
    }

    get currentScale() {
        return this._scale
    }

    getState() {
        return this.elements.map((element) => element.clone())
    }

    restoreState(elements: Element[]) {
        this.replaceElements(...elements.map((element) => element.clone()))
    }

    toImageURL(type?: string, quality?: number) {
        // Create offScreenCanvas to keep the background color when downloading the image
        const offScreenCanvas = document.createElement('canvas')
        offScreenCanvas.width = this.width
        offScreenCanvas.height = this.height
        const offScreenCanvasContext = offScreenCanvas.getContext('2d')!

        const backgroundColor = this.element.style.backgroundColor
        offScreenCanvasContext.fillStyle = backgroundColor
        offScreenCanvasContext.fillRect(0, 0, this.width, this.height)
        offScreenCanvasContext.drawImage(this.element, 0, 0)

        return offScreenCanvas.toDataURL(type, quality)
    }

    private moveElement(
        element: Element,
        getNewPosition: (index: number) => number
    ) {
        const index = this.elements.indexOf(element)
        if (index !== -1) {
            this.elements.splice(index, 1)
            const newIndex = getNewPosition(index)
            this.elements.splice(newIndex, 0, element)
            this.redraw()
            this.emitChangeEvent()
        }
    }

    sendElementToFront(element: Element) {
        this.moveElement(element, () => this.elements.length)
    }

    sendElementToBack(element: Element) {
        this.moveElement(element, () => 0)
    }

    sendElementForward(element: Element) {
        this.moveElement(element, (index) =>
            index !== this.elements.length - 1 ? index + 1 : index
        )
    }

    sendElementBackward(element: Element) {
        this.moveElement(element, (index) => (index !== 0 ? index - 1 : index))
    }
}
