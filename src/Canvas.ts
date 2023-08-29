import { ImagePath } from './elements/Image'
import { Path } from './elements/Path'

abstract class Observable {
    private observers: (() => void)[] = []
    subscribe(observer: () => void) {
        this.observers.push(observer)
    }

    protected notify() {
        for (const observer of this.observers) {
            observer()
        }
    }
}

export class Canvas extends Observable {
    element: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private paths: Path[] = []
    readonly offset = { x: 0, y: 0 }
    scale = 1.0
    constructor(element: HTMLCanvasElement) {
        super()
        this.element = element
        this.ctx = element.getContext('2d')!
    }

    set width(value: number) {
        this.element.width = value
        this.redraw()
    }

    set height(value: number) {
        this.element.height = value
        this.redraw()
    }

    get width() {
        return this.element.width
    }

    get height() {
        return this.element.height
    }

    private erase() {
        this.ctx.reset()
        this.ctx.translate(this.offset.x, this.offset.y)
    }

    clear() {
        this.paths.splice(0)
        this.notify()
        this.erase()
    }

    private redraw() {
        this.erase()
        this.ctx.scale(this.scale, this.scale)
        for (const path of this.paths) {
            this.drawPath(path)
        }
    }

    private drawPath(path: Path) {
        this.ctx.lineWidth = path.lineWidth
        this.ctx.lineCap = path.lineCap
        path.strokeStyle && (this.ctx.strokeStyle = path.strokeStyle)
        path.fillStyle && (this.ctx.fillStyle = path.fillStyle)
        path.font && (this.ctx.font = path.font)
        path.lineJoin && (this.ctx.lineJoin = path.lineJoin)
        this.ctx.save()
        this.ctx.translate(-path.offset.x, -path.offset.y)
        path.filled && this.ctx.fill(path)
        path.stroked && this.ctx.stroke(path)
        if (path instanceof ImagePath)
            this.ctx.drawImage(path.imageElement, path.x, path.y)
        this.ctx.restore()
    }

    addPath(path: Path) {
        this.paths.push(path)
        this.drawPath(path)
        this.notify()
    }

    removePathByIndex(pathIndex: number) {
        this.paths.splice(pathIndex, 1)
        this.redraw()
        this.notify()
    }

    removePath(path: Path) {
        const pathIndex = this.paths.indexOf(path)
        if (pathIndex !== -1) this.removePathByIndex(pathIndex)
    }

    removePathInPoint(x: number, y: number) {
        const pathToRemoveIndex = this.paths.findIndex((path) => {
            return this.ctx.isPointInStroke(
                path,
                x + path.offset.x,
                y + path.offset.y
            )
        })
        if (pathToRemoveIndex !== -1) this.removePathByIndex(pathToRemoveIndex)
    }

    get isEmpty() {
        return this.paths.length === 0
    }

    translate(x: number, y: number) {
        this.ctx.translate(x, y)
        this.offset.x += x
        this.offset.y += y
        this.redraw()
    }

    getPathInPoint(x: number, y: number) {
        return this.paths.find((path) => {
            return this.ctx.isPointInStroke(
                path,
                x + path.offset.x,
                y + path.offset.y
            )
        })
    }

    getState() {
        return this.paths
    }

    restoreState(paths: Path[]) {
        this.paths = [...paths]
        this.redraw()
    }
}

export class CanvasHistory extends Observable {
    private readonly undos: Path[][] = [[]]
    private readonly redos: Path[][] = []
    private sizeMax = 30
    private _canUndo = false
    private _canRedo = false

    constructor(private canvas: Canvas) {
        super()
        this.canvas.subscribe(() => {
            this.add(this.canvas.getState())
        })
    }

    get canUndo() {
        return this._canUndo
    }

    get canRedo() {
        return this._canRedo
    }

    set canRedo(value) {
        this._canRedo = value
        this.notify()
    }

    set canUndo(value) {
        this._canUndo = value
        this.notify()
    }

    add(paths: Path[]) {
        if (this.undos.length === this.sizeMax) {
            this.undos.shift()
        }
        this.undos.push([...paths])
        this.redos.splice(0)
        this.canUndo = true
        this.canRedo = false
    }

    undo() {
        if (this.undos.length === 1) return
        if (this.undos.length === 2) this.canUndo = false
        const currentState = this.undos.pop()!
        const previousState = this.undos[this.undos.length - 1]
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
