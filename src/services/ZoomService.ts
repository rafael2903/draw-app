import { Canvas } from '../Canvas'
import { Observable } from '../Observable'

interface ZoomEventMap {
    change: number
}

export class ZoomService extends Observable<ZoomEventMap> {
    private _scale = 1.0
    private static readonly MAX_SCALE = 10.0
    private static readonly MIN_SCALE = 0.1

    constructor(private elementsCanvas: Canvas) {
        super()
        this.elementsCanvas.setScale(this._scale)
    }

    get scale() {
        return this._scale
    }

    private set scale(value: number) {
        if (value < ZoomService.MIN_SCALE) value = ZoomService.MIN_SCALE
        if (value > ZoomService.MAX_SCALE) value = ZoomService.MAX_SCALE
        if (value === this._scale) return
        this._scale = value
        this.elementsCanvas.setScale(this._scale)
        this.emit('change', this._scale)
    }

    zoomIn(factor: number = 0.1) {
        this.scale += factor
    }

    zoomOut(factor: number = 0.1) {
        this.scale -= factor
    }

    setScale(scale: number) {
        this.scale = scale
    }

    reset() {
        this.scale = 1.0
    }

    zoom(factor: number) {
        this.scale = this.scale + factor
    }
}
