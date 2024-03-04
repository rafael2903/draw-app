import { ToolName } from '../types'
import { ToolsService } from './ToolsService'

const shapesContainer = document.querySelector('#shapes-container')!
const shapesButton = shapesContainer.querySelector('#shapes-button')!
const shapesIcon = shapesButton.querySelector('svg')!
const shapesBar = shapesContainer.querySelector('#shapes-bar')!

const shapesButtons = new Map<ToolName, HTMLButtonElement | null>([
    [ToolName.Ellipse, document.querySelector('#ellipse-button')],
    [ToolName.Rectangle, document.querySelector('#rectangle-button')],
    [ToolName.Triangle, document.querySelector('#triangle-button')],
])

const shapesIcons = new Map<ToolName, Node | undefined>([
    [
        ToolName.Ellipse,
        document.querySelector('#ellipse-button svg')?.cloneNode(true),
    ],
    [
        ToolName.Rectangle,
        document.querySelector('#rectangle-button svg')?.cloneNode(true),
    ],
    [
        ToolName.Triangle,
        document.querySelector('#triangle-button svg')?.cloneNode(true),
    ],
])

export class ShapesUIService {
    private lastActiveShape?: ToolName
    private activeButton?: HTMLButtonElement | null

    constructor(private toolsService: ToolsService) {
        shapesButton.addEventListener('click', () => {
            shapesBar.classList.toggle('hidden')
            if (this.lastActiveShape) {
                this.setActiveShape(this.lastActiveShape)
            }
        })

        shapesButtons.forEach((shapeButton, shapeName) => {
            shapeButton?.addEventListener('click', () => {
                this.setActiveShape(shapeName)
                shapesBar.classList.add('hidden')
            })
        })

        this.toolsService.on('active-tool-change', (e) => {
            this.onToolChange(e.activeTool)
        })

        window.addEventListener('pointerdown', (e) => this.onUIClick(e))
    }

    private setActiveShape(shapeName: ToolName) {
        this.activeButton?.classList.remove('active')
        this.activeButton = shapesButtons.get(shapeName)
        this.activeButton?.classList.add('active')
        this.toolsService.setActiveTool(shapeName)
        const activeShapeIcon = shapesIcons.get(shapeName)
        activeShapeIcon && shapesButton.replaceChildren(activeShapeIcon)
        shapesButton.classList.add('active')
        this.lastActiveShape = shapeName
    }

    private onToolChange(toolName: ToolName) {
        if (shapesButtons.has(toolName) || !this.lastActiveShape) return
        shapesButtons.get(this.lastActiveShape)?.classList.remove('active')
        shapesButton.classList.remove('active')
        shapesButton.replaceChildren(shapesIcon)
    }

    private onUIClick(e: PointerEvent) {
        if (shapesBar.classList.contains('hidden')) return

        const isOutsideClick =
            !shapesBar.contains(e.target as Node) &&
            !shapesButton.contains(e.target as Node)

        if (isOutsideClick) {
            shapesBar.classList.add('hidden')
        }
    }
}
