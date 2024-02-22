import { Canvas } from './Canvas'
import { CanvasHistory } from './CanvasHistory'
import './ConfigureIcons'
import { Shortcut } from './Shortcut'
import { HistoryService, ZoomService } from './services'
import './style.css'
import {
    AddImage,
    DownloadCanvasImage,
    DrawEllipse,
    DrawLine,
    Erase,
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
export const canvasHistory = new CanvasHistory(elementsCanvas)
const historyService = new HistoryService(canvasHistory, redoButton, undoButton)
const zoomService = new ZoomService(elementsCanvas)

zoomService.on('change', (scale) => {
    scaleDisplay.innerText = `${Math.round(scale * 100)}%`
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
}

const tools: Record<ToolName, Tool> = {
    [ToolName.Pen]: new Paint(elementsCanvas, interactionCanvas),
    [ToolName.Line]: new DrawLine(elementsCanvas, interactionCanvas),
    [ToolName.Move]: new Move(elementsCanvas, interactionCanvas),
    [ToolName.Select]: new Select(elementsCanvas, interactionCanvas),
    [ToolName.Ellipse]: new DrawEllipse(elementsCanvas, interactionCanvas),
    [ToolName.Erase]: new Erase(elementsCanvas, interactionCanvas),
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
        setActiveTool(tool as ToolName)
    })
}

onEvent(clearCanvasButton, 'click', () => {
    elementsCanvas.clear()
    canvasHistory.save()
})

onEvent(downloadCanvasImageButton, 'click', () => {
    DownloadCanvasImage.download(elementsCanvas)
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
        elementsCanvas.setTranslation(
            (window.innerWidth / 2) * Math.sign(e.deltaY),
            (window.innerHeight / 2) * Math.sign(e.deltaY)
        )
        zoomService.zoom(e.deltaY * -ZOOM_SPEED)
    } else {
        elementsCanvas.translate(-e.deltaX, -e.deltaY)
    }
})

function onEvent<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: K,
    listener: (ev: HTMLElementEventMap[K]) => void
): void
function onEvent(
    element: HTMLElement,
    event: Array<keyof HTMLElementEventMap>,
    listener: (ev: Event) => void
): void
function onEvent<K extends keyof DocumentEventMap>(
    element: Document,
    event: K,
    listener: (ev: DocumentEventMap[K]) => void
): void
function onEvent(
    element: Document,
    event: Array<keyof DocumentEventMap>,
    listener: (ev: Event) => void
): void
function onEvent<K extends keyof WindowEventMap>(
    element: Window,
    event: K,
    listener: (ev: WindowEventMap[K]) => void
): void
function onEvent(
    element: Window,
    event: Array<keyof WindowEventMap>,
    listener: (ev: Event) => void
): void
function onEvent(
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
