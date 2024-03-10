import { Observable } from './Observable'
import {
    Element,
    ImageElement,
    Line,
    Polyline,
    Selection,
    Shape,
} from './elements'
import { Point } from './types'

interface CanvasEventMap {
    change: Element[]
    'element-added': Element
    'element-removed': Element
    'element-changed': Element
}

export class Canvas extends Observable<CanvasEventMap> {
    element: HTMLCanvasElement // todo: tornar privado e criar métodos para notificar eventos
    private ctx: CanvasRenderingContext2D
    private elements: Element[] = []
    private _translationX = 0
    private _translationY = 0
    private _currentScale = 1.0
    private _cursor = 'default'

    constructor(element: HTMLCanvasElement) {
        super()
        this.element = element
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
            this._currentScale,
            0,
            0,
            this._currentScale,
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

    private drawElement(element: Element) {
        this.ctx.lineWidth = element.lineWidth
        this.ctx.globalAlpha = element.opacity
        element.strokeStyle && (this.ctx.strokeStyle = element.strokeStyle)
        element.fillStyle && (this.ctx.fillStyle = element.fillStyle)

        if (element instanceof ImageElement) {
            this.ctx.drawImage(element.image, element.x, element.y)
        }

        if (
            element instanceof Shape ||
            element instanceof Polyline ||
            element instanceof Selection
        ) {
            element.filled && this.ctx.fill(element.path)
            element.stroked && this.ctx.stroke(element.path)
        }
    }

    private drawElements() {
        this.elements.forEach((element) => this.drawElement(element))
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
            element.translate(-this.translationX, -this.translationY)
            element.on('change', this.onElementChange)
        })
        this.elements.splice(0, Infinity, ...newElements)
        this.redraw()
        this.emitChangeEvent()
    }

    clear() {
        this.replaceElements()
    }

    private onElementChange = (element: Element) => {
        this.redraw()
        this.emitChangeEvent()
        this.emit('element-changed', element)
    }

    addElementWithTranslation(element: Element) {
        element.translate(-this.translationX, -this.translationY)
        this.addElement(element)
    }

    addElement(element: Element) {
        this.elements.push(element)
        this.drawElement(element)
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

    private isPointInStroke(element: Element, point: Point) {
        if (element instanceof Polyline || element instanceof Line) {
            return this.ctx.isPointInStroke(element.path, point.x, point.y)
        }

        if (element instanceof Shape) {
            return this.ctx.isPointInPath(element.path, point.x, point.y)
        }

        if (element instanceof ImageElement) {
            return (
                point.x - this._translationX >= element.x &&
                point.x - this._translationX <= element.x + element.width &&
                point.y - this._translationY >= element.y &&
                point.y - this._translationY <= element.y + element.height
            )
        }
    }

    removeElementAtPoint(point: Point) {
        const elementToRemoveIndex = this.elements.findLastIndex((element) => {
            return this.isPointInStroke(element, point)
        })

        if (elementToRemoveIndex !== -1) {
            return this.removeElementsByIndex(elementToRemoveIndex)[0]
        }
    }

    getElementAtPoint(point: Point) {
        return this.getElementsAtPoint(point).at(-1)
    }

    getElementsAtPoint(point: Point) {
        return this.elements.filter((element) => {
            return this.isPointInStroke(element, point)
        })
    }

    getElementsInBox(x: number, y: number, width: number, height: number) {
        return this.elements.filter((element) => {
            return (
                element.x >= x - this._translationX &&
                element.x + element.width <= x + width - this._translationX &&
                element.y >= y - this._translationY &&
                element.y + element.height <= y + height - this._translationY
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

    get centerX() {
        return this.width / 2 - this.translationX
    }

    get centerY() {
        return this.height / 2 - this.translationY
    }

    setScale(newScale: number) {
        this._currentScale = newScale
        this.updateTransformationMatrix()
        this.redraw()
        return this._currentScale
    }

    scale(scalingFactor: number) {
        const newScale = this._currentScale + scalingFactor
        return this.setScale(newScale)
    }

    get currentScale() {
        return this._currentScale
    }

    getState() {
        return this.elements.map((el) => el.clone())
    }

    restoreState(elements: Element[]) {
        this.replaceElements(...elements.map((el) => el.clone()))
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
