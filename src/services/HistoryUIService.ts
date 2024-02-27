import { CanvasHistory, HistoryChangeEvent } from '../CanvasHistory'

export class HistoryUIService {
    constructor(
        private history: CanvasHistory,
        private redoButton: HTMLButtonElement,
        private undoButton: HTMLButtonElement
    ) {
        this.history.on('change', (e) => this.updateButtons(e))
    }

    private updateButtons({ canUndo, canRedo }: HistoryChangeEvent) {
        this.undoButton.disabled = !canUndo
        this.redoButton.disabled = !canRedo
    }

    onUndoPress() {
        this.history.undo()
        this.undoButton.classList.add('pressed')
    }

    onRedoPress() {
        this.history.redo()
        this.redoButton.classList.add('pressed')
    }

    onUndoRelease() {
        this.undoButton.classList.remove('pressed')
    }

    onRedoRelease() {
        this.redoButton.classList.remove('pressed')
    }
}
