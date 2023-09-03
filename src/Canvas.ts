import { EventsManager } from './EventsManager'
import { Element, ImageElement, Polyline, Shape } from './elements'

interface CanvasEventMap {
    change: Element[]
}

export class Canvas extends EventsManager<CanvasEventMap> {
    element: HTMLCanvasElement // todo: tornar privado e criar métodos para notificar eventos
    private ctx: CanvasRenderingContext2D
    private elements: Element[] = []
    private _translationX = 0
    private _translationY = 0
    private _currentScale = 1.0
    private static readonly MAX_SCALE = 10.0
    private static readonly MIN_SCALE = 0.1

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
        element.strokeStyle && (this.ctx.strokeStyle = element.strokeStyle)
        element.fillStyle && (this.ctx.fillStyle = element.fillStyle)
        if (element instanceof ImageElement)
            this.ctx.drawImage(element.image, element.x, element.y)
        if (element instanceof Shape || element instanceof Polyline) {
            element.filled && this.ctx.fill(element.path)
            element.stroked && this.ctx.stroke(element.path)
        }
    }

    private drawElements() {
        for (const element of this.elements) {
            this.drawElement(element)
        }
    }

    private redraw() {
        this.erase()
        this.drawElements()
    }

    replaceElements(...newElements: Element[]) {
        this.elements.splice(0, Infinity, ...newElements)
        this.redraw()
    }

    clear() {
        this.replaceElements()
    }

    private onElementChange = () => {
        this.redraw()
    }

    addElement(element: Element) {
        this.elements.push(element)
        this.drawElement(element)
        element.on('change', this.onElementChange)
    }

    removeElementByIndex(elementIndex: number) {
        const element = this.elements[elementIndex]
        element.off('change', this.onElementChange)
        this.elements.splice(elementIndex, 1)
        this.redraw()
        return element
    }

    removeElement(element: Element) {
        const elementIndex = this.elements.indexOf(element)
        if (elementIndex !== -1) {
            return this.removeElementByIndex(elementIndex)
        }
    }

    private isPointInStroke(element: Element, x: number, y: number) {
        if (element instanceof ImageElement) {
            return (
                x - this._translationX >= element.x &&
                x - this._translationX <= element.x + element.width &&
                y - this._translationY >= element.y &&
                y - this._translationY <= element.y + element.height
            )
        }
        if (element instanceof Polyline || element instanceof Shape) {
            return this.ctx.isPointInStroke(element.path, x, y)
        }
    }

    removeElementInPoint(x: number, y: number) {
        const elementToRemoveIndex = this.elements.findLastIndex((element) => {
            return this.isPointInStroke(element, x, y)
        })
        if (elementToRemoveIndex !== -1) {
            return this.removeElementByIndex(elementToRemoveIndex)
        }
    }

    getElementInPoint(x: number, y: number) {
        return this.elements.findLast((element) => {
            return this.isPointInStroke(element, x, y)
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

    setScale(newScale: number) {
        if (newScale <= Canvas.MIN_SCALE) newScale = Canvas.MIN_SCALE
        if (newScale >= Canvas.MAX_SCALE) newScale = Canvas.MAX_SCALE
        this._currentScale = newScale
        this.updateTransformationMatrix()
        this.redraw()
        return this._currentScale
    }

    scale(scalingFactor: number) {
        let newScale = this._currentScale + scalingFactor
        return this.setScale(newScale)
    }

    get currentScale() {
        return this._currentScale
    }

    getState() {
        return this.elements
    }

    restoreState(elements: Element[]) {
        this.elements.splice(0, Infinity, ...elements)
        this.redraw()
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
}

interface CanvasHistoryEventMap {
    'undo-change': boolean
    'redo-change': boolean
    change: {
        canRedo: boolean
        canUndo: boolean
    }
}

export class CanvasHistory extends EventsManager<CanvasHistoryEventMap> {
    private undos: Element[][] = [[]]
    private redos: Element[][] = []
    private sizeMax = 50
    private _canUndo = false
    private _canRedo = false

    constructor(private canvas: Canvas) {
        super()
    }

    save() {
        this.add(this.canvas.getState())
    }

    get canUndo() {
        return this._canUndo
    }

    get canRedo() {
        return this._canRedo
    }

    set canRedo(value) {
        this._canRedo = value
        this.emit('redo-change', value)
        this.emit('change', { canRedo: value, canUndo: this.canUndo })
    }

    set canUndo(value) {
        this._canUndo = value
        this.emit('undo-change', value)
        this.emit('change', { canRedo: this.canRedo, canUndo: value })
    }

    add(elements: Element[]) {
        if (this.undos.length === this.sizeMax) {
            this.undos.shift()
        }
        const newState = elements.map((element) => element.clone())
        this.undos.push(newState)
        this.redos.splice(0)
        this.canUndo = true
        this.canRedo = false
    }

    undo() {
        if (this.undos.length === 1) return
        if (this.undos.length === 2) this.canUndo = false
        const currentState = this.undos.pop()!
        const previousState = this.undos.at(-1)!
        this.canvas.restoreState(previousState)
        this.redos.push(currentState)
        this.canRedo = true
    }

    redo() {
        if (this.redos.length === 0) return
        if (this.redos.length === 1) this.canRedo = false
        const nextState = this.redos.pop()!
        this.canvas.restoreState(nextState)
        this.undos.push(nextState)
        this.canUndo = true
    }
}
