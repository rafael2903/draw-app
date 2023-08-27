import { CanvasHistory } from '../Canvas'

export class HistoryControl {
    constructor(
        private drawHistory: CanvasHistory,
        private redoButton: HTMLButtonElement,
        private undoButton: HTMLButtonElement
    ) {
        this.drawHistory.subscribe(() => {
            this.updateButtons()
        })
    }

    private updateButtons() {
        this.undoButton.disabled = !this.drawHistory.canUndo
        this.redoButton.disabled = !this.drawHistory.canRedo
    }

    undo() {
        this.drawHistory.undo()
    }

    redo() {
        this.drawHistory.redo()
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
