import { Canvas, CanvasHistory } from './Canvas'
import './config-icons'
import './style.css'
import {
    AddImage,
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

const interactionCanvasElement = document.getElementById(
    'interaction-canvas'
)! as HTMLCanvasElement
const elementsCanvasElement = document.getElementById(
    'elements-canvas'
)! as HTMLCanvasElement
const clearCanvasButton = document.getElementById('clear')!
const downloadCanvasImageButton = document.getElementById('download')!
const penButton = document.getElementById('pen')!
const moveButton = document.getElementById('move')!
const selectButton = document.getElementById('select')!
const eraseButton = document.getElementById('erase')!
const ellipseButton = document.getElementById('ellipse')!
const lineButton = document.getElementById('line')!
const addImageButton = document.getElementById('add-image')! as HTMLInputElement
const undoButton = document.getElementById('undo')! as HTMLButtonElement
const redoButton = document.getElementById('redo')! as HTMLButtonElement
// const zoomIn = document.getElementById<HTMLButtonElement>('#zoom-in')!
// const zoomOut = document.getElementById<HTMLButtonElement>('#zoom-out')!

const interactionCanvas = new Canvas(interactionCanvasElement)
const elementsCanvas = new Canvas(elementsCanvasElement)

interactionCanvas.width = elementsCanvas.width = window.innerWidth
interactionCanvas.height = elementsCanvas.height = window.innerHeight

window.addEventListener('resize', () => {
    interactionCanvas.width = elementsCanvas.width = window.innerWidth
    interactionCanvas.height = elementsCanvas.height = window.innerHeight
})

const drawHistory = new CanvasHistory(elementsCanvas)
const historyControl = new HistoryControl(drawHistory, redoButton, undoButton)

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
    document.getElementById(tool)!.classList.add('active')
    // @ts-ignore
    interactionCanvas.element.style.cursor = tools[tool].cursor
    interactionCanvas.element.onpointerdown = handlePointerDown
    window.onpointermove = handlePointerMove
    window.onpointerup = handlePointerUp
}

setActiveTool(ToolName.Pen)

clearCanvasButton.addEventListener('click', () => {
    elementsCanvas.clear()
})

downloadCanvasImageButton.addEventListener('click', () => {
    DownloadCanvasImage.download(elementsCanvas.element, 'picture')
})

selectButton.addEventListener('click', () => {
    setActiveTool(ToolName.Select)
})

moveButton.addEventListener('click', () => {
    setActiveTool(ToolName.Move)
})

penButton.addEventListener('click', () => {
    setActiveTool(ToolName.Pen)
})

eraseButton.addEventListener('click', () => {
    setActiveTool(ToolName.Erase)
})

ellipseButton.addEventListener('click', () => {
    setActiveTool(ToolName.Ellipse)
})

lineButton.addEventListener('click', () => {
    setActiveTool(ToolName.Line)
})

addImageButton.addEventListener('change', () => {
    const file = addImageButton.files?.[0]
    if (file) {
        AddImage.add(
            file,
            elementsCanvas,
            elementsCanvas.width / 2,
            elementsCanvas.height / 2
        )
    }
})

undoButton.addEventListener('click', historyControl.undo.bind(historyControl))
redoButton.addEventListener('click', historyControl.redo.bind(historyControl))

window.addEventListener('keydown', (e) => {
    if (e.key === 'z' && e.ctrlKey) {
        historyControl.onUndoPress()
    } else if (e.key === 'y' && e.ctrlKey) {
        historyControl.onRedoPress()
    }
})

window.addEventListener('keyup', (e) => {
    if (e.key === 'z' && undoButton.classList.contains('pressed')) {
        historyControl.onUndoRelease()
    } else if (e.key === 'y' && redoButton.classList.contains('pressed')) {
        historyControl.onRedoRelease()
    }
})

document.onpaste = function (e) {
    e.preventDefault()
    const file = e.clipboardData?.files[0]
    if (file) {
        AddImage.add(
            file,
            elementsCanvas,
            elementsCanvas.width / 2,
            elementsCanvas.height / 2
        )
    }
}

interactionCanvas.element.ondragover = (e) => {
    e.preventDefault()
}

interactionCanvas.element.ondragstart = (e) => {
    e.preventDefault()
}

interactionCanvas.element.ondragleave = (e) => {
    e.preventDefault()
    interactionCanvas.element.classList.remove('dropping')
}

interactionCanvas.element.ondragend = (e) => {
    e.preventDefault()
    interactionCanvas.element.classList.remove('dropping')
}

interactionCanvas.element.ondragenter = (e) => {
    e.preventDefault()
    interactionCanvas.element.classList.add('dropping')
}

interactionCanvas.element.ondrop = (e) => {
    e.preventDefault()
    interactionCanvas.element.classList.remove('dropping')
    const file = e.dataTransfer?.files[0]
    if (file) {
        AddImage.add(file, elementsCanvas, e.x, e.y)
    }
}

// zoomIn.addEventListener('click', () => {
//     elementsCanvas.scale += 0.1
//     elementsCanvas.redraw()
// })

// zoomOut.addEventListener('click', () => {
//     elementsCanvas.scale -= 0.1
//     elementsCanvas.redraw()
// })
