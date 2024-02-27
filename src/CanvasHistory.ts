import { Canvas } from './Canvas'
import { Observable } from './Observable'
import { Element } from './elements'

export interface HistoryChangeEvent {
    canRedo: boolean
    canUndo: boolean
}

interface CanvasHistoryEventMap {
    'undo-change': boolean
    'redo-change': boolean
    change: HistoryChangeEvent
}

export class CanvasHistory extends Observable<CanvasHistoryEventMap> {
    private undos: Element[][] = [[]]
    private redos: Element[][] = []
    private sizeMax = 50
    private _canUndo = false
    private _canRedo = false
    private paused = false

    constructor(private canvas: Canvas) {
        super()
    }

    get canUndo() {
        return this._canUndo
    }

    get canRedo() {
        return this._canRedo
    }

    private set canRedo(value) {
        this._canRedo = value
        this.emit('redo-change', value)
        this.emit('change', { canRedo: value, canUndo: this.canUndo })
    }

    private set canUndo(value) {
        this._canUndo = value
        this.emit('undo-change', value)
        this.emit('change', { canRedo: this.canRedo, canUndo: value })
    }

    private add(state: Element[]) {
        if (this.undos.length === this.sizeMax) {
            this.undos.shift()
        }
        this.undos.push(state)
        this.redos.splice(0)
        this.canUndo = true
        this.canRedo = false
    }

    save() {
        if (this.paused) return
        this.add(this.canvas.getState())
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

    pause() {
        this.paused = true
    }

    continue() {
        this.paused = false
    }
}
