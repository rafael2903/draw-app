import { EventsManager } from '../EventsManager'

export type ElementProperties = {
    filled?: boolean
    fillStyle?: string
    stroked?: boolean
    strokeStyle?: string
    lineWidth?: number
}

interface ElementEventMap {
    change: undefined
}

export abstract class Element extends EventsManager<ElementEventMap> {
    private _x = 0
    private _y = 0
    private _width = 0
    private _height = 0
    private _filled = false
    private _fillStyle = 'black'
    private _stroked = true
    private _strokeStyle = 'black'
    private _lineWidth = 10
    abstract clone(): Element

    constructor(elementProperties?: ElementProperties) {
        super()
        this._fillStyle = elementProperties?.fillStyle ?? this._fillStyle
        this._filled = elementProperties?.filled ?? this._filled
        this._lineWidth = elementProperties?.lineWidth ?? this._lineWidth
        this._strokeStyle = elementProperties?.strokeStyle ?? this._strokeStyle
        this._stroked = elementProperties?.stroked ?? this._stroked
    }

    translate(x: number, y: number) {
        this._x += x
        this._y += y
        this.emit('change', undefined)
    }

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

    protected set x(value: number) {
        this._x = value
        this.emit('change', undefined)
    }

    protected set y(value: number) {
        this._y = value
        this.emit('change', undefined)
    }

    protected set width(value: number) {
        this._width = value
        this.emit('change', undefined)
    }

    protected set height(value: number) {
        this._height = value
        this.emit('change', undefined)
    }

    set filled(value: boolean) {
        this._filled = value
        this.emit('change', undefined)
    }

    set fillStyle(value: string) {
        this._fillStyle = value
        this.emit('change', undefined)
    }

    set stroked(value: boolean) {
        this._stroked = value
        this.emit('change', undefined)
    }

    set strokeStyle(value: string) {
        this._strokeStyle = value
        this.emit('change', undefined)
    }

    set lineWidth(value: number) {
        this._lineWidth = value
        this.emit('change', undefined)
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

export abstract class Shape extends Element {
    static fromStartAndEnd: (
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) => Shape
    abstract path: Path2D
}
