import { CanvasHistory } from '../CanvasHistory'

export class HistoryControl {
    constructor(
        private history: CanvasHistory,
        private redoButton: HTMLButtonElement,
        private undoButton: HTMLButtonElement
    ) {
        this.history.on('change', () => this.updateButtons())
    }

    private updateButtons() {
        this.undoButton.disabled = !this.history.canUndo
        this.redoButton.disabled = !this.history.canRedo
    }

    undo() {
        this.history.undo()
    }

    redo() {
        this.history.redo()
    }

    onUndoPress() {
        this.undo()
        this.undoButton.classList.add('pressed')
    }

    onRedoPress() {
        this.redo()
        this.redoButton.classList.add('pressed')
    }

    onUndoRelease() {
        this.undoButton.classList.remove('pressed')
    }

    onRedoRelease() {
        this.redoButton.classList.remove('pressed')
    }
}
