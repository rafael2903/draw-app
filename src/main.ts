import { Canvas, CanvasHistory } from './Canvas'
import './icons'
import './style.css'
import {
    DownloadCanvasImage,
    DrawEllipse,
    DrawLine,
    Erase,
    HistoryControl,
    Move,
    Paint,
    Select,
} from './tools'
import { Tool, ToolName } from './types'

const interactionCanvasElement = document.querySelector<HTMLCanvasElement>(
    '#interaction-canvas'
)!
const elementsCanvasElement =
    document.querySelector<HTMLCanvasElement>('#elements-canvas')!
const clearCanvas = document.querySelector('#clear')!
const downloadCanvasImage = document.querySelector('#download')!
const pen = document.querySelector('#pen')!
const move = document.querySelector('#move')!
const select = document.querySelector('#select')!
const erase = document.querySelector('#erase')!
const ellipse = document.querySelector('#ellipse')!
const line = document.querySelector('#line')!
const undo = document.querySelector<HTMLButtonElement>('#undo')!
const redo = document.querySelector<HTMLButtonElement>('#redo')!
// const zoomIn = document.querySelector<HTMLButtonElement>('#zoom-in')!
// const zoomOut = document.querySelector<HTMLButtonElement>('#zoom-out')!

const interactionCanvas = new Canvas(interactionCanvasElement)
const elementsCanvas = new Canvas(elementsCanvasElement)

interactionCanvas.width = elementsCanvas.width = window.innerWidth
interactionCanvas.height = elementsCanvas.height = window.innerHeight

window.addEventListener('resize', () => {
    interactionCanvas.width = elementsCanvas.width = window.innerWidth
    interactionCanvas.height = elementsCanvas.height = window.innerHeight
})

const drawHistory = new CanvasHistory(elementsCanvas)
const historyControl = new HistoryControl(drawHistory, redo, undo)

const tools: Record<ToolName, Tool> = {
    [ToolName.Pen]: Paint.init(elementsCanvas, interactionCanvas),
    [ToolName.Line]: DrawLine.init(elementsCanvas, interactionCanvas),
    [ToolName.Move]: Move.init(elementsCanvas, interactionCanvas),
    [ToolName.Select]: Select.init(elementsCanvas, interactionCanvas),
    [ToolName.Ellipse]: DrawEllipse.init(elementsCanvas, interactionCanvas),
    [ToolName.Erase]: Erase.init(elementsCanvas, interactionCanvas),
}

function handlePointerDown(e: PointerEvent) {
    if (e.button === 0) {
        // @ts-ignore
        tools[activeTool].pointerDown(e)
    } else if (e.button === 1) {
        interactionCanvas.clear()
        Move.pointerDown(e)
    }
}

function handlePointerMove(e: PointerEvent) {
    if (e.button === -1 && e.buttons >= 4) {
        Move.pointerMove(e)
    } else {
        // @ts-ignore
        tools[activeTool].pointerMove(e)
    }
}

function handlePointerUp(e: PointerEvent) {
    if (e.button === 0) {
        // @ts-ignore
        tools[activeTool].pointerUp(e)
    } else if (e.button === 1) {
        Move.pointerUp()
        // @ts-ignore
        interactionCanvas.element.style.cursor = tools[activeTool].cursor
    }
}

let activeTool: ToolName
const setActiveTool = (tool: ToolName) => {
    if (activeTool === tool) return
    activeTool = tool
    document.querySelector('.tool.active')?.classList.remove('active')
    document.querySelector(`#${tool}`)!.classList.add('active')
    // @ts-ignore
    interactionCanvas.element.style.cursor = tools[tool].cursor
    interactionCanvas.element.onpointerdown = handlePointerDown
    window.onpointermove = handlePointerMove
    window.onpointerup = handlePointerUp
}

setActiveTool(ToolName.Pen)

clearCanvas.addEventListener('click', () => {
    elementsCanvas.clear()
})

downloadCanvasImage.addEventListener('click', () => {
    DownloadCanvasImage.downloadImage(elementsCanvas.element, 'desenho')
})

select.addEventListener('click', () => {
    setActiveTool(ToolName.Select)
})

move.addEventListener('click', () => {
    setActiveTool(ToolName.Move)
})

pen.addEventListener('click', () => {
    setActiveTool(ToolName.Pen)
})

erase.addEventListener('click', () => {
    setActiveTool(ToolName.Erase)
})

ellipse.addEventListener('click', () => {
    setActiveTool(ToolName.Ellipse)
})

line.addEventListener('click', () => {
    setActiveTool(ToolName.Line)
})

undo.addEventListener('click', historyControl.undo.bind(historyControl))
redo.addEventListener('click', historyControl.redo.bind(historyControl))

window.addEventListener('keydown', (e) => {
    if (e.key === 'z' && e.ctrlKey) {
        historyControl.onUndoPress()
    } else if (e.key === 'y' && e.ctrlKey) {
        historyControl.onRedoPress()
    }
})

window.addEventListener('keyup', (e) => {
    if (e.key === 'z' && undo.classList.contains('pressed')) {
        historyControl.onUndoRelease()
    } else if (e.key === 'y' && redo.classList.contains('pressed')) {
        historyControl.onRedoRelease()
    }
})

// zoomIn.addEventListener('click', () => {
//     elementsCanvas.scale += 0.1
//     elementsCanvas.redraw()
// })

// zoomOut.addEventListener('click', () => {
//     elementsCanvas.scale -= 0.1
//     elementsCanvas.redraw()
// })
