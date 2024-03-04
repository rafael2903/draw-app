import { Canvas } from '../Canvas'
import { Observable } from '../Observable'
import { canvasHistory } from '../main'
import { Draw, DrawShape, Erase, Move, Select, ShapeType } from '../tools'
import { Tool, ToolName } from '../types'

export interface ChangeEvent {
    activeTool: ToolName
}

interface ToolsServiceEventMap {
    'active-tool-change': ChangeEvent
}

export class ToolsService extends Observable<ToolsServiceEventMap> {
    private tools: Record<ToolName, Tool>
    private activeTool?: Tool

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {
        super()
        this.tools = {
            [ToolName.Select]: new Select(
                this.elementsCanvas,
                this.interactionCanvas,
                canvasHistory
            ),
            [ToolName.Move]: new Move(
                this.elementsCanvas,
                this.interactionCanvas
            ),
            [ToolName.Pen]: new Draw(
                this.elementsCanvas,
                this.interactionCanvas
            ),
            [ToolName.Erase]: new Erase(this.elementsCanvas),
            [ToolName.Line]: new DrawShape(
                ShapeType.Line,
                this.elementsCanvas,
                this.interactionCanvas
            ),
            [ToolName.Ellipse]: new DrawShape(
                ShapeType.Ellipse,
                this.elementsCanvas,
                this.interactionCanvas
            ),
            [ToolName.Triangle]: new DrawShape(
                ShapeType.Triangle,
                this.elementsCanvas,
                this.interactionCanvas
            ),
            [ToolName.Rectangle]: new DrawShape(
                ShapeType.Rectangle,
                this.elementsCanvas,
                this.interactionCanvas
            ),
        }
    }

    private handlePointerDown(e: PointerEvent) {
        this.interactionCanvas.element.setPointerCapture(e.pointerId)
        if (e.button === 0) {
            this.activeTool?.onPointerDown(e)
        } else if (e.button === 1) {
            this.interactionCanvas.clear()
            this.tools[ToolName.Move].onPointerDown(e)
        }
    }

    private handlePointerMove(e: PointerEvent) {
        if (e.button === -1 && e.buttons >= 4) {
            this.tools[ToolName.Move].onPointerMove(e)
        } else {
            this.activeTool?.onPointerMove(e)
        }
    }

    private handlePointerUp(e: PointerEvent) {
        if (e.button === 0) {
            this.activeTool?.onPointerUp()
        } else if (e.button === 1) {
            this.tools[ToolName.Move].onPointerUp()
            this.interactionCanvas.element.style.cursor =
                this.activeTool?.cursor || 'auto'
        }
    }

    setActiveTool(toolName: ToolName) {
        const tool = this.tools[toolName]
        if (tool === this.activeTool) return
        this.activeTool = tool
        this.interactionCanvas.element.style.cursor = this.activeTool.cursor
        this.interactionCanvas.element.onpointerdown = (e) =>
            this.handlePointerDown(e)
        this.interactionCanvas.element.onpointermove = (e) =>
            this.handlePointerMove(e)
        this.interactionCanvas.element.onpointerup = (e) =>
            this.handlePointerUp(e)
        this.interactionCanvas.element.onpointerleave = () =>
            this.activeTool?.onPointerLeave?.()
        this.emit('active-tool-change', { activeTool: toolName })
    }
}
