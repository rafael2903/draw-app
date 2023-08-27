import { Canvas, CanvasHistory } from './Canvas'
import './icons'
import './style.css'
import { DrawEllipse } from './tools/DrawEllipse'
import { DrawLine } from './tools/DrawLine'
import { Erase } from './tools/Erase'
import { HistoryControl } from './tools/HistoryControl'
import { Move } from './tools/Move'
import { Paint } from './tools/Paint'
import { Select } from './tools/Select'
import { Tool, ToolName } from './types'

const interactionCanvasElement = document.querySelector<HTMLCanvasElement>(
    '#interaction-canvas'
)!
const elementsCanvasElement =
    document.querySelector<HTMLCanvasElement>('#elements-canvas')!
const pen = document.querySelector<HTMLButtonElement>('#pen')!
const move = document.querySelector<HTMLButtonElement>('#move')!
const select = document.querySelector<HTMLButtonElement>('#select')!
const erase = document.querySelector<HTMLButtonElement>('#erase')!
const ellipse = document.querySelector<HTMLButtonElement>('#ellipse')!
const line = document.querySelector<HTMLButtonElement>('#line')!
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
    [ToolName.Pen]: Paint,
    [ToolName.Line]: DrawLine,
    [ToolName.Move]: Move,
    [ToolName.Select]: Select,
    [ToolName.Ellipse]: DrawEllipse,
    [ToolName.Erase]: Erase,
}

let activeTool: ToolName
const setActiveTool = (tool: ToolName) => {
    if (activeTool === tool) return
    tools[activeTool]?.tearDown()
    activeTool = tool
    document
        .querySelector<HTMLButtonElement>('.tool.active')
        ?.classList.remove('active')

    document
        .querySelector<HTMLButtonElement>(`#${tool}`)!
        .classList.add('active')
    interactionCanvas.element.style.cursor = tools[tool].cursor

    tools[tool].setUp(interactionCanvas, elementsCanvas)
}

setActiveTool(ToolName.Pen)

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
