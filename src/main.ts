import { Hand, MousePointer, Pen, createIcons } from 'lucide'
import './style.css'

createIcons({
    icons: {
        Pen,
        Hand,
        MousePointer,
    },
})

const interactionCanvas = document.querySelector<HTMLCanvasElement>(
    '#interaction-canvas'
)!
const elementsCanvas =
    document.querySelector<HTMLCanvasElement>('#elements-canvas')!
const interactionCtx = interactionCanvas.getContext('2d')!
const elementsCtx = elementsCanvas.getContext('2d')!

type Tool = 'pen' | 'move' | 'select'
let activeTool: Tool
const setActiveTool = (tool: Tool) => {
  if (activeTool === tool) return
  activeTool = tool
  document
  .querySelector<HTMLButtonElement>('.tool.active')
  ?.classList.remove('active')
  document
  .querySelector<HTMLButtonElement>(`#${tool}`)!
  .classList.add('active')
}
setActiveTool('select')

const pen = document.querySelector<HTMLButtonElement>('#pen')!
const move = document.querySelector<HTMLButtonElement>('#move')!
const select = document.querySelector<HTMLButtonElement>('#select')!

select.addEventListener('click', () => {
    setActiveTool('select')
    interactionCanvas.style.cursor = 'default'
})

move.addEventListener('click', () => {
    setActiveTool('move')
    interactionCanvas.style.cursor = 'grab'
})

pen.addEventListener('click', () => {
    setActiveTool('pen')
    interactionCanvas.style.cursor = 'none'
})

let drawing = false
// const paths: Path2D[] = []

const pointerPositions: PointerEvent[] = []

interactionCanvas.width = elementsCanvas.width = window.innerWidth
interactionCanvas.height = elementsCanvas.height = window.innerHeight

window.addEventListener('resize', () => {
    interactionCanvas.width = elementsCanvas.width = window.innerWidth
    interactionCanvas.height = elementsCanvas.height = window.innerHeight
})

elementsCtx.fillRect(0, 0, 50, 50)

window.addEventListener('pointermove', (e) => {
    if (activeTool === 'pen') {
        if (drawing) {
            const coalescedEvents = e.getCoalescedEvents()
            pointerPositions.push(...coalescedEvents)
        } else {
            interactionCtx.clearRect(
                0,
                0,
                interactionCanvas.width,
                interactionCanvas.height
            )
            interactionCtx.beginPath()
            interactionCtx.arc(e.offsetX, e.offsetY, 5, 0, 2 * Math.PI)
            interactionCtx.fill()
        }
    }
})

window.addEventListener('pointerup', () => {
    // elementsCtx.closePath()
    drawing = false
    pointerPositions.length = 0
})

const draw = () => {
    if (!drawing) return
    if (activeTool === 'pen') {
        while (pointerPositions.length > 0) {
            const e = pointerPositions.shift()!
            elementsCtx.lineWidth = 10
            elementsCtx.lineCap = 'round'
            elementsCtx.lineTo(e.pageX, e.pageY)
            elementsCtx.stroke()
            elementsCtx.beginPath()
            elementsCtx.moveTo(e.pageX, e.pageY)
        }
        requestAnimationFrame(draw)
    }
}

interactionCanvas.addEventListener('pointerdown', (e) => {
    if (activeTool === 'pen' && e.button === 0) {
        drawing = true
        elementsCtx.moveTo(e.offsetX, e.offsetY)
        pointerPositions.push(e)
        draw()
    }
})

interactionCanvas.addEventListener('pointerout', () => {
    // drawing = false
    interactionCtx.clearRect(
        0,
        0,
        interactionCanvas.width,
        interactionCanvas.height
    )
})
