import { Hand, MousePointer, Pen, createIcons, ZoomIn, ZoomOut, Circle, Eraser } from 'lucide'
import './style.css'
import { Move } from './tools/Move'
import { Paint } from './tools/Paint'
import { Tool, ToolName } from './types'
import { DrawEllipse } from './tools/DrawEllipse'
import { Erase } from './tools/Erase'
import { Select } from './tools/Select'
import { Path } from './types'

createIcons({
    icons: {
        Pen,
        Hand,
        MousePointer,
        Eraser,
        Circle,
        ZoomIn,
        ZoomOut,
    },
})



// export class Path extends Path2D {
//     offset = { x: 0, y: 0 }
//     x = 0
//     y = 0
//     width = 0
//     height = 0

//     constructor() {
//         super()
//     }
// }

export class Canvas {
    ctx: CanvasRenderingContext2D
    element: HTMLCanvasElement
    paths: Path[] = []
    offset = { x: 0, y: 0 }
    scale = 1.0
    constructor(element: HTMLCanvasElement) {
        this.element = element
        this.ctx = element.getContext('2d')!
    }

    draw() {
        console.log(this.paths)
        this.clear()
        this.ctx.scale(this.scale, this.scale)
        for (const path of this.paths) {
            this.ctx.lineWidth = 10
            this.ctx.lineCap = 'round'
            this.ctx.save()
            this.ctx.translate(-path.offset.x, -path.offset.y)
            this.ctx.stroke(path)
            this.ctx.restore()
        }
    }

    clear() {
      this.ctx.clearRect(-this.offset.x, -this.offset.y, this.element.width, this.element.height )
    }
}

const interactionCanvasEl = document.querySelector<HTMLCanvasElement>(
    '#interaction-canvas'
)!
const interactionCanvas = new Canvas(interactionCanvasEl)

const elementsCanvasEl =
    document.querySelector<HTMLCanvasElement>('#elements-canvas')!
const elementsCanvas = new Canvas(elementsCanvasEl)

const tools: Record<ToolName, Tool> = {
    pen: Paint,
    move: Move,
    select: Select,
    ellipse: DrawEllipse,
    erase: Erase,
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
const zoomIn = document.querySelector<HTMLButtonElement>('#zoom-in')!
const zoomOut = document.querySelector<HTMLButtonElement>('#zoom-out')!


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

zoomIn.addEventListener('click', () => {
    elementsCanvas.scale += 0.1
    elementsCanvas.draw()
})

zoomOut.addEventListener('click', () => {
    elementsCanvas.scale -= 0.1
    elementsCanvas.draw()
})

interactionCanvas.element.width = elementsCanvas.element.width =
    window.innerWidth
interactionCanvas.element.height = elementsCanvas.element.height =
    window.innerHeight

window.addEventListener('resize', () => {
    interactionCanvas.element.width = elementsCanvas.element.width =
        window.innerWidth
    interactionCanvas.element.height = elementsCanvas.element.height =
        window.innerHeight

    elementsCanvas.draw()
})
