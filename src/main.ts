import { Canvas } from './Canvas'
import { CanvasHistory } from './CanvasHistory'
import './ConfigureIcons'
import { Shortcut } from './Shortcut'
import { ExportCanvasService, HistoryUIService, ZoomService } from './services'
import './style.css'
import {
    AddImage,
    Draw,
    DrawShape,
    Erase,
    Move,
    Select,
    ShapeType,
} from './tools'
import { OnEvent, Tool } from './types'

enum ToolName {
    Pen,
    Move,
    Select,
    Ellipse,
    Rectangle,
    Erase,
    Line,
    Triangle,
}

const onEvent: OnEvent = function (
    element: HTMLElement | Document | Window,
    event: unknown,
    listener: (ev: Event) => void
) {
    const events = Array.isArray(event) ? event : [event]
    events.forEach((e) => {
        element.addEventListener(e, listener)
    })
}

function addClassOnEvent(
    element: HTMLElement,
    event: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap>,
    className: string
) {
    // @ts-ignore
    onEvent(element, event, (e) => {
        e.preventDefault()
        element.classList.add(className)
    })
}

function removeClassOnEvent(
    element: HTMLElement,
    event: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap>,
    className: string
) {
    // @ts-ignore
    onEvent(element, event, (e) => {
        e.preventDefault()
        element.classList.remove(className)
    })
}

const interactionCanvasElement = document.getElementById(
    'interaction-canvas'
)! as HTMLCanvasElement
const elementsCanvasElement = document.getElementById(
    'elements-canvas'
)! as HTMLCanvasElement
const clearCanvasButton = document.getElementById('clear-button')!
const downloadCanvasImageButton = document.getElementById('download-button')!
const addImageButton = document.getElementById('add-image')! as HTMLInputElement
const undoButton = document.getElementById('undo-button')! as HTMLButtonElement
const redoButton = document.getElementById('redo-button')! as HTMLButtonElement
const zoomOutButton = document.getElementById(
    'zoom-out-button'
)! as HTMLButtonElement
const zoomInButton = document.getElementById(
    'zoom-in-button'
)! as HTMLButtonElement
const scaleDisplay = document.getElementById(
    'scale-display'
)! as HTMLButtonElement

const interactionCanvas = new Canvas(interactionCanvasElement)
const elementsCanvas = new Canvas(elementsCanvasElement)
const canvasHistory = new CanvasHistory(elementsCanvas)

elementsCanvas.on('element-added', () => {
    canvasHistory.save()
})

elementsCanvas.on('element-removed', () => {
    canvasHistory.save()
})

const historyService = new HistoryUIService(
    canvasHistory,
    redoButton,
    undoButton
)
const zoomService = new ZoomService(elementsCanvas)

zoomService.on('change', ({ scale, canZoomIn, canZoomOut }) => {
    scaleDisplay.innerText = `${Math.round(scale * 100)}%`
    zoomOutButton.disabled = !canZoomOut
    zoomInButton.disabled = !canZoomIn
})

let activeTool: ToolName

interactionCanvas.width = elementsCanvas.width = window.innerWidth
interactionCanvas.height = elementsCanvas.height = window.innerHeight

onEvent(window, 'resize', () => {
    interactionCanvas.width = elementsCanvas.width = window.innerWidth
    interactionCanvas.height = elementsCanvas.height = window.innerHeight
})

const toolButtonsIds: Record<ToolName, string> = {
    [ToolName.Select]: 'select-button',
    [ToolName.Move]: 'move-button',
    [ToolName.Pen]: 'pen-button',
    [ToolName.Erase]: 'erase-button',
    [ToolName.Ellipse]: 'ellipse-button',
    [ToolName.Line]: 'line-button',
    [ToolName.Rectangle]: 'rectangle-button',
    [ToolName.Triangle]: 'triangle-button',
}

const tools: Record<ToolName, Tool> = {
    [ToolName.Select]: new Select(
        elementsCanvas,
        interactionCanvas,
        canvasHistory
    ),
    [ToolName.Move]: new Move(elementsCanvas, interactionCanvas),
    [ToolName.Pen]: new Draw(elementsCanvas, interactionCanvas),
    [ToolName.Erase]: new Erase(elementsCanvas),
    [ToolName.Line]: new DrawShape(
        ShapeType.Line,
        elementsCanvas,
        interactionCanvas
    ),
    [ToolName.Ellipse]: new DrawShape(
        ShapeType.Ellipse,
        elementsCanvas,
        interactionCanvas
    ),
    [ToolName.Triangle]: new DrawShape(
        ShapeType.Triangle,
        elementsCanvas,
        interactionCanvas
    ),
    [ToolName.Rectangle]: new DrawShape(
        ShapeType.Rectangle,
        elementsCanvas,
        interactionCanvas
    ),
}

function handlePointerDown(e: PointerEvent) {
    if (e.button === 0) {
        tools[activeTool].onPointerDown(e)
    } else if (e.button === 1) {
        interactionCanvas.clear()
        tools[ToolName.Move].onPointerDown(e)
    }
}

function handlePointerMove(e: PointerEvent) {
    if (e.button === -1 && e.buttons >= 4) {
        tools[ToolName.Move].onPointerMove(e)
    } else {
        tools[activeTool].onPointerMove(e)
    }
}

function handlePointerUp(e: PointerEvent) {
    if (e.button === 0) {
        tools[activeTool].onPointerUp()
    } else if (e.button === 1) {
        tools[ToolName.Move].onPointerUp()
        interactionCanvas.element.style.cursor = tools[activeTool].cursor
    }
}

const setActiveTool = (tool: ToolName) => {
    if (activeTool === tool) return
    activeTool = tool
    document.querySelector('#tools .button.active')?.classList.remove('active')
    document.getElementById(toolButtonsIds[tool])?.classList.add('active')
    interactionCanvas.element.style.cursor = tools[tool].cursor
    interactionCanvas.element.onpointerdown = handlePointerDown
    window.onpointermove = handlePointerMove
    window.onpointerup = handlePointerUp
}

setActiveTool(ToolName.Pen)

for (const [tool, toolButtonId] of Object.entries(toolButtonsIds)) {
    document.getElementById(toolButtonId)?.addEventListener('click', () => {
        setActiveTool(tool as unknown as ToolName)
    })
}

onEvent(clearCanvasButton, 'click', () => {
    elementsCanvas.clear()
    // canvasHistory.save()
})

onEvent(downloadCanvasImageButton, 'click', () => {
    ExportCanvasService.download(elementsCanvas)
})

onEvent(undoButton, 'click', historyService.undo.bind(historyService))
onEvent(redoButton, 'click', historyService.redo.bind(historyService))

Shortcut.onKeyDown('ctrl + z', historyService.onUndoPress.bind(historyService))
Shortcut.onKeyDown('ctrl + y', historyService.onRedoPress.bind(historyService))

Shortcut.onKeyDown(
    [
        { key: '+', ctrl: true },
        { key: '=', ctrl: true },
    ],
    () => {
        zoomService.zoomIn()
    }
)

Shortcut.onKeyDown('ctrl + -, ctrl + _', () => {
    zoomService.zoomOut()
})

Shortcut.onKeyDown('ctrl + 0', () => {
    zoomService.reset()
})

onEvent(zoomInButton, 'click', () => {
    zoomService.zoomIn()
})

onEvent(scaleDisplay, 'click', () => {
    zoomService.reset()
})

onEvent(zoomOutButton, 'click', () => {
    zoomService.zoomOut()
})

Shortcut.onKeyUp('z', historyService.onUndoRelease.bind(historyService))
Shortcut.onKeyUp('y', historyService.onRedoRelease.bind(historyService))

onEvent(interactionCanvas.element, ['dragover', 'dragstart'], (e) => {
    e.preventDefault()
})

removeClassOnEvent(
    interactionCanvas.element,
    ['dragleave', 'dragend', 'drop'],
    'dropping'
)

addClassOnEvent(interactionCanvas.element, 'dragenter', 'dropping')

onEvent(interactionCanvas.element, 'drop', (e) => {
    e.preventDefault()
    interactionCanvas.element.classList.remove('dropping')
    const file = e.dataTransfer?.files[0]
    if (file) {
        AddImage.add(
            file,
            elementsCanvas,
            e.x - elementsCanvas.translationX,
            e.y! - elementsCanvas.translationY
        )
    }
})

onEvent(document, 'paste', (e) => {
    e.preventDefault()
    const file = e.clipboardData?.files[0]
    if (file) {
        AddImage.add(
            file,
            elementsCanvas,
            elementsCanvas.width / 2 - elementsCanvas.translationX,
            elementsCanvas.height / 2 - elementsCanvas.translationY
        )
    }
})

onEvent(addImageButton, 'change', () => {
    const file = addImageButton.files?.[0]
    if (file) {
        AddImage.add(
            file,
            elementsCanvas,
            elementsCanvas.width / 2 - elementsCanvas.translationX,
            elementsCanvas.height / 2 - elementsCanvas.translationY
        )
    }
})

onEvent(interactionCanvas.element, 'wheel', (e) => {
    e.preventDefault()
    if (e.ctrlKey) {
        const ZOOM_SPEED = 0.0025
        // elementsCanvas.setTranslation(
        //     (window.innerWidth / 2) * Math.sign(e.deltaY),
        //     (window.innerHeight / 2) * Math.sign(e.deltaY)
        // )
        zoomService.zoom(e.deltaY * -ZOOM_SPEED)
    } else {
        elementsCanvas.translate(-e.deltaX, -e.deltaY)
    }
})
