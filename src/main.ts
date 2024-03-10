import { Canvas } from './Canvas'
import { CanvasHistory } from './CanvasHistory'
import './ConfigureIcons'
import { addClassOnEvent, onEvent, removeClassOnEvent } from './EventUtilities'
import { Shortcut } from './Shortcut'
import {
    ExportCanvasService,
    HistoryUIService,
    ShapesUIService,
    ToolbarUIService,
    ToolsService,
    ZoomService,
    ZoomUIService,
} from './services'
import './style.css'
import { AddImage } from './tools'

const interactionCanvasElement = document.getElementById(
    'interaction-canvas'
)! as HTMLCanvasElement
const elementsCanvasElement = document.getElementById(
    'elements-canvas'
)! as HTMLCanvasElement
const clearCanvasButton = document.getElementById('clear-button')!
const downloadCanvasImageButton = document.getElementById('download-button')!
const addImageInput = document.getElementById('add-image')! as HTMLInputElement
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

interactionCanvas.width = elementsCanvas.width = window.innerWidth
interactionCanvas.height = elementsCanvas.height = window.innerHeight

onEvent(window, 'resize', () => {
    interactionCanvas.width = elementsCanvas.width = window.innerWidth
    interactionCanvas.height = elementsCanvas.height = window.innerHeight
})

export const canvasHistory = new CanvasHistory(elementsCanvas)
elementsCanvas.on('element-added', () => canvasHistory.save())
elementsCanvas.on('element-removed', () => canvasHistory.save())

const historyUIService = new HistoryUIService(
    canvasHistory,
    redoButton,
    undoButton
)

const zoomService = new ZoomService(elementsCanvas)
const zoomUIService = new ZoomUIService(
    zoomService,
    scaleDisplay,
    zoomOutButton,
    zoomInButton
)

const toolsService = new ToolsService(elementsCanvas, interactionCanvas)
new ToolbarUIService(toolsService)
new ShapesUIService(toolsService)

onEvent(clearCanvasButton, 'click', () => elementsCanvas.clear())

onEvent(downloadCanvasImageButton, 'click', () => {
    ExportCanvasService.download(elementsCanvas)
})

onEvent(undoButton, 'click', () => canvasHistory.undo())
Shortcut.onKeyDown('ctrl + z', () => historyUIService.onUndoPress(), {
    caseSensitive: false,
})
Shortcut.onKeyUp('z', () => historyUIService.onUndoRelease(), {
    caseSensitive: false,
})

onEvent(redoButton, 'click', () => canvasHistory.redo())
Shortcut.onKeyDown('ctrl + y', () => historyUIService.onRedoPress(), {
    caseSensitive: false,
})
Shortcut.onKeyUp('y', () => historyUIService.onRedoRelease(), {
    caseSensitive: false,
})

onEvent(zoomInButton, 'click', () => zoomService.zoomIn())
Shortcut.onKeyDown('ctrl > +, ctrl > =', () => zoomUIService.onZoomInPress(), {
    keysSeparator: '>',
})
Shortcut.onKeyUp('ctrl > +, ctrl > =', () => zoomUIService.onZoomInRelease(), {
    keysSeparator: '>',
})

onEvent(zoomOutButton, 'click', () => zoomService.zoomOut())
Shortcut.onKeyDown('ctrl + -, ctrl + _', () => zoomUIService.onZoomOutPress())
Shortcut.onKeyUp('ctrl + -, ctrl + _', () => zoomUIService.onZoomOutRelease())

onEvent(scaleDisplay, 'click', () => zoomService.reset())
Shortcut.onKeyDown('ctrl + 0', () => zoomUIService.onResetPress())
Shortcut.onKeyUp('ctrl + 0', () => zoomUIService.onResetRelease())

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
            elementsCanvas.centerX,
            elementsCanvas.centerY
        )
    }
})

onEvent(addImageInput, 'change', () => {
    const file = addImageInput.files?.[0]
    if (file) {
        AddImage.add(
            file,
            elementsCanvas,
            elementsCanvas.centerX,
            elementsCanvas.centerY
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

Shortcut.onKeyDown([{ key: 'Escape', caseSensitive: true }], () => {
    toolsService.cancelActiveToolAction()
})
