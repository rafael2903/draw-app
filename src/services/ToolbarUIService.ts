import { ToolName } from '../types'
import { ToolsService } from './ToolsService'

const toolsButtons = new Map<ToolName, HTMLButtonElement | null>([
    [ToolName.Select, document.querySelector('#select-button')],
    [ToolName.Move, document.querySelector('#move-button')],
    [ToolName.Pen, document.querySelector('#pen-button')],
    [ToolName.Erase, document.querySelector('#erase-button')],
    [ToolName.Line, document.querySelector('#line-button')],
])

export class ToolbarUIService {
    private activeButton?: HTMLButtonElement | null

    constructor(private toolsService: ToolsService) {
        toolsButtons.forEach((toolButton, toolName) => {
            toolButton?.addEventListener('click', () => {
                this.setActiveTool(toolName)
            })
        })

        this.toolsService.on('active-tool-change', (e) => {
            this.onToolChange(e.activeTool)
        })

        this.setActiveTool(ToolName.Pen)
    }

    private setActiveTool(toolName: ToolName) {
        this.activeButton?.classList.remove('active')
        this.activeButton = toolsButtons.get(toolName)
        this.activeButton?.classList.add('active')
        this.toolsService.setActiveTool(toolName)
    }

    private onToolChange(toolName: ToolName) {
        if (!toolsButtons.has(toolName)) {
            this.activeButton?.classList.remove('active')
        }
    }
}
