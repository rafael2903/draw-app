import { Observable } from '../Observable'

export type ElementProperties = {
    filled?: boolean
    fillStyle?: string
    stroked?: boolean
    strokeStyle?: string
    lineWidth?: number
    opacity?: number
}

interface ElementEventMap {
    change: Element
}

export abstract class Element extends Observable<ElementEventMap> {
    private _x = 0
    private _y = 0
    private _width = 0
    private _height = 0
    private _filled = false
    private _fillStyle = 'black'
    private _stroked = true
    private _strokeStyle = 'black'
    private _lineWidth = 10
    private _opacity = 1
    // protected focused = false
    abstract clone(): Element

    constructor(elementProperties?: ElementProperties) {
        super()
        this._fillStyle = elementProperties?.fillStyle ?? this._fillStyle
        this._filled = elementProperties?.filled ?? this._filled
        this._lineWidth = elementProperties?.lineWidth ?? this._lineWidth
        this._strokeStyle = elementProperties?.strokeStyle ?? this._strokeStyle
        this._stroked = elementProperties?.stroked ?? this._stroked
        this._opacity = elementProperties?.opacity ?? this._opacity
    }

    translate(x: number, y: number) {
        this._x += x
        this._y += y
        this.emit('change', this)
    }

    // focus() {
    //     this.focused = true
    //     this.emit('change', this)
    // }

    // blur() {
    //     this.focused = false
    //     this.emit('change', this)
    // }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }

    get filled() {
        return this._filled
    }

    get fillStyle() {
        return this._fillStyle
    }

    get stroked() {
        return this._stroked
    }

    get strokeStyle() {
        return this._strokeStyle
    }

    get lineWidth() {
        return this._lineWidth
    }

    get opacity() {
        return this._opacity
    }

    protected set x(value: number) {
        this._x = value
        this.emit('change', this)
    }

    protected set y(value: number) {
        this._y = value
        this.emit('change', this)
    }

    protected set width(value: number) {
        this._width = value
        this.emit('change', this)
    }

    protected set height(value: number) {
        this._height = value
        this.emit('change', this)
    }

    set filled(value: boolean) {
        this._filled = value
        this.emit('change', this)
    }

    set fillStyle(value: string) {
        this._fillStyle = value
        this.emit('change', this)
    }

    set stroked(value: boolean) {
        this._stroked = value
        this.emit('change', this)
    }

    set strokeStyle(value: string) {
        this._strokeStyle = value
        this.emit('change', this)
    }

    set lineWidth(value: number) {
        this._lineWidth = value
        this.emit('change', this)
    }

    set opacity(value: number) {
        this._opacity = value
        this.emit('change', this)
    }

    overlapsWith(element: Element) {
        return (
            element.x >= this.x &&
            element.x + element.width <= this.x + this.width &&
            element.y >= this.y &&
            element.y + element.height <= this.y + this.height
        )
    }

    // isInPoint(x: number, y: number, ctx: CanvasRenderingContext2D) {
    //     return ctx.isPointInStroke(this.path, x, y)
    // }

    // applyProperties(ctx: CanvasRenderingContext2D) {
    //     ctx.fillStyle = this._fillStyle
    //     ctx.strokeStyle = this._strokeStyle
    //     ctx.lineWidth = this._lineWidth
    // }

    // fillAndStroke(ctx: CanvasRenderingContext2D) {
    //     this._filled && ctx.fill()
    //     this._stroked && ctx.stroke()
    // }

    // get elementProperties() {
    //     return {
    //         filled: this._filled,
    //         fillStyle: this._fillStyle,
    //         stroked: this._stroked,
    //         strokeStyle: this._strokeStyle,
    //         lineWidth: this._lineWidth,
    //     }
    // }
}
