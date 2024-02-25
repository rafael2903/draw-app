import { Canvas } from '../Canvas'
import { Observable } from '../Observable'

interface Event {
    scale: number
    canZoomIn: boolean
    canZoomOut: boolean
}

interface ZoomEventMap {
    change: Event
}

export class ZoomService extends Observable<ZoomEventMap> {
    private static readonly MAX_SCALE = 10.0
    private static readonly MIN_SCALE = 0.1
    private static readonly OFFSET = 0.005 // To avoid floating point errors
    private _scale = 1.0
    private canZoomIn = true
    private canZoomOut = true

    constructor(private elementsCanvas: Canvas) {
        super()
        this.elementsCanvas.setScale(this._scale)
    }

    get scale() {
        return this._scale
    }

    private set scale(value: number) {
        if (value <= ZoomService.MIN_SCALE + ZoomService.OFFSET) {
            value = ZoomService.MIN_SCALE
            this.canZoomOut = false
        } else this.canZoomOut = true

        if (value >= ZoomService.MAX_SCALE - ZoomService.OFFSET) {
            value = ZoomService.MAX_SCALE
            this.canZoomIn = false
        } else this.canZoomIn = true

        if (value === this._scale) return
        this._scale = value
        this.elementsCanvas.setScale(this._scale)
        this.emit('change', {
            scale: this._scale,
            canZoomIn: this.canZoomIn,
            canZoomOut: this.canZoomOut,
        })
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
