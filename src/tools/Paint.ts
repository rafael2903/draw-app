// export const setUpPaint = (
//     interactionCanvas: HTMLCanvasElement,
//     elementsCanvas: HTMLCanvasElement
// ) => {
//     const interactionCtx = interactionCanvas.getContext('2d')!
//     const elementsCtx = elementsCanvas.getContext('2d')!

import { Canvas, Path } from '../main'
import { Tool, ToolName } from '../types'

//     const pointerEvents: PointerEvent[] = []

//     let drawing = false
//     elementsCtx.fillRect(0, 0, 50, 50)

//     window.addEventListener('pointermove', (e) => {
//         if (drawing) {
//             const coalescedEvents = e.getCoalescedEvents()
//             pointerEvents.push(...coalescedEvents)
//         } else {
//             interactionCtx.clearRect(
//                 0,
//                 0,
//                 interactionCanvas.width,
//                 interactionCanvas.height
//             )
//             interactionCtx.beginPath()
//             interactionCtx.arc(e.offsetX, e.offsetY, 5, 0, 2 * Math.PI)
//             interactionCtx.fill()
//         }
//     })

//     window.addEventListener('pointerup', () => {
//         drawing = false
//         pointerEvents.length = 0
//     })

//     const draw = () => {
//         if (!drawing) return
//         while (pointerEvents.length > 0) {
//             const e = pointerEvents.shift()!
//             elementsCtx.lineWidth = 10
//             elementsCtx.lineCap = 'round'
//             elementsCtx.lineTo(e.pageX, e.pageY)
//             elementsCtx.stroke()
//             elementsCtx.beginPath()
//             elementsCtx.moveTo(e.pageX, e.pageY)
//         }
//         requestAnimationFrame(draw)
//     }

//     interactionCanvas.addEventListener('pointerdown', (e) => {
//         if (e.button === 0) {
//             drawing = true
//             elementsCtx.moveTo(e.offsetX, e.offsetY)
//             pointerEvents.push(e)
//             draw()
//         }
//     })

//     interactionCanvas.addEventListener('pointerout', () => {
//         interactionCtx.clearRect(
//             0,
//             0,
//             interactionCanvas.width,
//             interactionCanvas.height
//         )
//     })
// }

export class Paint extends Tool {
    static name = ToolName.Pen
    static cursor = 'none'
    private static currentPath: Path
    private static painting = false
    private static pointerEvents: PointerEvent[] = []
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas
    private static interactionCtx: CanvasRenderingContext2D
    private static elementsCtx: CanvasRenderingContext2D


    private static draw() {
        if (!Paint.painting) return
        while (Paint.pointerEvents.length > 0) {
            const e = Paint.pointerEvents.shift()!
            Paint.currentPath.lineTo(e.pageX, e.pageY)
            Paint.currentPath.moveTo(e.pageX, e.pageY)
            Paint.interactionCtx.lineWidth = 10
            Paint.interactionCtx.lineCap = 'round'
            Paint.interactionCtx.lineTo(e.pageX, e.pageY)
            Paint.interactionCtx.stroke()
            Paint.interactionCtx.beginPath()
            Paint.interactionCtx.moveTo(e.pageX, e.pageY)
        }
        requestAnimationFrame(Paint.draw)
    }

    static pointerDown(e: PointerEvent) {
        if (e.button === 0) {
            Paint.painting = true
            Paint.currentPath = new Path()
            Paint.interactionCtx.moveTo(e.offsetX, e.offsetY)
            Paint.currentPath.moveTo(e.offsetX, e.offsetY)
            Paint.pointerEvents.push(e)
            console.log(Paint.interactionCtx)
            Paint.draw()
        }
    }

    static pointerMove(e: PointerEvent) {
        if (Paint.painting) {
            const coalescedEvents = e.getCoalescedEvents()
            Paint.pointerEvents.push(...coalescedEvents)
        } else {
            Paint.interactionCtx.clearRect(
                0,
                0,
                Paint.interactionCanvas.element.width,
                Paint.interactionCanvas.element.height
            )
            Paint.interactionCtx.beginPath()
            Paint.interactionCtx.arc(e.clientX, e.clientY, 5, 0, 2 * Math.PI)
            Paint.interactionCtx.fill()
        }
    }

    static pointerUp() {
        Paint.painting = false
        Paint.pointerEvents.length = 0
        Paint.currentPath.offset.x = Paint.elementsCanvas.offset.x
        Paint.currentPath.offset.y = Paint.elementsCanvas.offset.y
        Paint.elementsCanvas.paths.push(Paint.currentPath)
        Paint.elementsCanvas.draw()
    }

    static pointerOut() {
        // Paint.interactionCtx.clearRect(
        //     0,
        //     0,
        //     Paint.interactionCanvas.element.width,
        //     Paint.interactionCanvas.element.height
        // )
    }

    static setUp(
        interactionCanvas: Canvas,
        elementsCanvas: Canvas,
    ) {
        Paint.interactionCanvas = interactionCanvas
        Paint.interactionCtx = interactionCanvas.element.getContext('2d')!
        Paint.elementsCanvas = elementsCanvas
        Paint.elementsCtx = elementsCanvas.element.getContext('2d')!

        Paint.interactionCanvas.element.addEventListener(
            'pointerdown',
            Paint.pointerDown
        )
        window.addEventListener('pointermove', Paint.pointerMove)
        window.addEventListener('pointerup', Paint.pointerUp)
        Paint.interactionCanvas.element.addEventListener('pointerout', Paint.pointerOut)
    }

    static tearDown() {
        Paint.interactionCanvas.element.removeEventListener(
            'pointerdown',
            Paint.pointerDown
        )
        window.removeEventListener(
            'pointermove',
            Paint.pointerMove
        )
        window.removeEventListener(
            'pointerup',
            Paint.pointerUp
        )
        Paint.interactionCanvas.element.removeEventListener(
            'pointerout',
            Paint.pointerOut
        )
    }
}
