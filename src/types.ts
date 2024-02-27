

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

export interface Tool {
    cursor: string
    cursorOnPointerDown?: string
    onPointerDown: (e: PointerEvent) => void
    onPointerMove: (e: PointerEvent) => void
    onPointerUp: () => void
}

export class Point {
    constructor(public x: number = 0, public y: number = 0) {}
}
