export enum ToolName {
    Pen = 'pen',
    Move = 'move',
    Select = 'select',
    Ellipse = 'ellipse',
    Erase = 'erase',
    Line = 'line',
}

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

export type OnEvent = {
    <K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        event: K,
        listener: (ev: HTMLElementEventMap[K]) => void
    ): void
    (
        element: HTMLElement,
        event: Array<keyof HTMLElementEventMap>,
        listener: (ev: Event) => void
    ): void
    <K extends keyof DocumentEventMap>(
        element: Document,
        event: K,
        listener: (ev: DocumentEventMap[K]) => void
    ): void
    (
        element: Document,
        event: Array<keyof DocumentEventMap>,
        listener: (ev: Event) => void
    ): void
    <K extends keyof WindowEventMap>(
        element: Window,
        event: K,
        listener: (ev: WindowEventMap[K]) => void
    ): void
    (
        element: Window,
        event: Array<keyof WindowEventMap>,
        listener: (ev: Event) => void
    ): void
}
