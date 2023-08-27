import { Canvas } from './Canvas'
import { DrawEllipse } from './tools/DrawEllipse'
import { DrawLine } from './tools/DrawLine'
import { Erase } from './tools/Erase'
import { Move } from './tools/Move'
import { Paint } from './tools/Paint'
import { Select } from './tools/Select'
import { Tool, ToolName } from './types'
import './icons'
import './style.css'

const interactionCanvasEl = document.querySelector<HTMLCanvasElement>(
    '#interaction-canvas'
)!
const interactionCanvas = new Canvas(interactionCanvasEl)

const elementsCanvasEl =
    document.querySelector<HTMLCanvasElement>('#elements-canvas')!
const elementsCanvas = new Canvas(elementsCanvasEl)

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

const pen = document.querySelector<HTMLButtonElement>('#pen')!
const move = document.querySelector<HTMLButtonElement>('#move')!
const select = document.querySelector<HTMLButtonElement>('#select')!
const erase = document.querySelector<HTMLButtonElement>('#erase')!
const ellipse = document.querySelector<HTMLButtonElement>('#ellipse')!
const line = document.querySelector<HTMLButtonElement>('#line')!
// const zoomIn = document.querySelector<HTMLButtonElement>('#zoom-in')!
// const zoomOut = document.querySelector<HTMLButtonElement>('#zoom-out')!

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

// zoomIn.addEventListener('click', () => {
//     elementsCanvas.scale += 0.1
//     elementsCanvas.redraw()
// })

// zoomOut.addEventListener('click', () => {
//     elementsCanvas.scale -= 0.1
//     elementsCanvas.redraw()
// })

interactionCanvas.element.width = elementsCanvas.element.width =
    window.innerWidth
interactionCanvas.element.height = elementsCanvas.element.height =
    window.innerHeight

window.addEventListener('resize', () => {
    interactionCanvas.element.width = elementsCanvas.element.width =
        window.innerWidth
    interactionCanvas.element.height = elementsCanvas.element.height =
        window.innerHeight

    elementsCanvas.redraw()
})
