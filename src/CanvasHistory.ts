import { Canvas } from './Canvas'
import { Observable } from './Observable'
import { Element } from './elements'

interface CanvasHistoryEventMap {
    'undo-change': boolean
    'redo-change': boolean
    change: {
        canRedo: boolean
        canUndo: boolean
    }
}

export class CanvasHistory extends Observable<CanvasHistoryEventMap> {
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
