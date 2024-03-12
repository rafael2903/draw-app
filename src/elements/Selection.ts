import { Element, ElementProperties } from './Element'
import { Shape } from './Shape'

export class Selection extends Shape {
    private selectedElements: Set<Element>
    private elementMovedMap = new Map<Element, boolean>()
    private _hasMoved = false

    constructor(
        selectedElements?: Iterable<Element>,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.lineWidth = 1
        this.stroked = true
        this.strokeStyle = '#0078d7'
        this.filled = true
        this.fillStyle = 'transparent'

        this.selectedElements = new Set(selectedElements)
        this.calculateBoundingBox()
    }

    private calculateBoundingBox() {
        if (this.selectedElements.size === 0) {
            this.width = 0
            this.height = 0
            return
        }

        let minX = Infinity
        let minY = Infinity
        let maxX = -Infinity
        let maxY = -Infinity

        this.selectedElements.forEach((element) => {
            minX = Math.min(minX, element.x, element.x + element.width)
            minY = Math.min(minY, element.y, element.y + element.height)
            maxX = Math.max(maxX, element.x, element.x + element.width)
            maxY = Math.max(maxY, element.y, element.y + element.height)
        })

        this.x = minX - 10
        this.y = minY - 10
        this.width = maxX - minX + 20
        this.height = maxY - minY + 20
    }

    clone() {
        return new Selection(this.selectedElements, this)
    }

    addElement(element: Element) {
        this.selectedElements.add(element)
        this.calculateBoundingBox()
    }

    removeElement(element: Element) {
        this.selectedElements.delete(element)
        this.elementMovedMap.delete(element)
        this.calculateBoundingBox()
        if (this.isEmpty) this._hasMoved = false
    }

    hasElement(element: Element) {
        return this.selectedElements.has(element)
    }

    clear() {
        this.selectedElements.clear()
        this.elementMovedMap.clear()
        this.calculateBoundingBox()
        this._hasMoved = false
    }

    [Symbol.iterator]() {
        return this.selectedElements[Symbol.iterator]()
    }

    forEach(callback: (element: Element) => void) {
        this.selectedElements.forEach(callback)
    }

    get size() {
        return this.selectedElements.size
    }

    getSelectedElementAtPoint(x: number, y: number) {
        return Array.from(this.selectedElements).find(
            (element) =>
                x >= element.x - 10 &&
                x <= element.x + element.width + 20 &&
                y >= element.y - 10 &&
                y <= element.y + element.height + 20
        )
    }

    get isEmpty() {
        return this.selectedElements.size === 0
    }

    isPointInsideBounds(x: number, y: number) {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        )
    }

    get hasMoved() {
        return this._hasMoved
    }

    override translate(x: number, y: number) {
        this.selectedElements.forEach((element) => {
            this.elementMovedMap.set(element, true)
            element.translate(x, y)
        })
        this._hasMoved = true
        super.translate(x, y)
    }

    hasElementMoved(element: Element) {
        return this.elementMovedMap.get(element) || false
    }

    // private getBorderPath(x: number, y: number, width: number, height: number) {
    //     return new Rectangle(x - 10, y - 10, width + 20, height + 20).path
    // }

    get path() {
        const boundingBoxPath = new Path2D()

        if (this.size > 1) {
            boundingBoxPath.rect(this.x, this.y, this.width, this.height)
        }

        this.selectedElements.forEach((element) => {
            boundingBoxPath.rect(
                element.x - 10,
                element.y - 10,
                element.width + 20,
                element.height + 20
            )
            const highlightELement = element.clone()
            if (
                'path' in highlightELement &&
                highlightELement.path instanceof Path2D
            ) {
                boundingBoxPath.addPath(highlightELement.path)
            }
        })

        return boundingBoxPath
    }
}
