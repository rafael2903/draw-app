// export abstract class Tool {
//     constructor(protected elementsCanvas: Canvas, protected interactionCanvas: Canvas) {
//     }

//     // abstract cursor: string
//     // abstract cursorOnPointerDown?: string
//     // static abstract new(elementsCanvas: Canvas, interactionCanvas: Canvas): T
//     // abstract onPointerDown(e: PointerEvent): void
//     // abstract onPointerMove(e: PointerEvent): void
//     // abstract onPointerUp(): void
// }
export enum ToolName {
    Pen,
    Move,
    Select,
    Ellipse,
    Rectangle,
    Erase,
    Line,
    Triangle,
}

export class CanvasPointerEvent extends PointerEvent {
    private _canvasY: number
    private _canvasX: number

    constructor(
        private canvasTranslationX: number,
        private canvasTranslationY: number,
        readonly originalEvent: PointerEvent
    ) {
        super(originalEvent.type, originalEvent)
        this._canvasX = originalEvent.x - this.canvasTranslationX
        this._canvasY = originalEvent.y - this.canvasTranslationY
    }

    get canvasX() {
        return this._canvasX
    }

    get canvasY() {
        return this._canvasY
    }

    override getCoalescedEvents(): CanvasPointerEvent[] {
        return this.originalEvent
            .getCoalescedEvents()
            .map(
                (e) =>
                    new CanvasPointerEvent(
                        this.canvasTranslationX,
                        this.canvasTranslationY,
                        e
                    )
            )
    }
}

export interface Tool {
    cursor: string
    cursorOnPointerDown?: string
    onPointerDown(e: CanvasPointerEvent): void
    onPointerMove(e: CanvasPointerEvent): void
    onPointerUp(e: CanvasPointerEvent): void
    onPointerLeave?(): void
    abortAction?(): void
    executingAction: boolean
}

export class Point {
    constructor(public x: number = 0, public y: number = 0) {}
}
