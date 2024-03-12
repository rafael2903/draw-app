import { Canvas } from '../Canvas'
import { Observable } from '../Observable'
import { canvasHistory } from '../main'
import { Draw, DrawShape, Erase, Move, Select, ShapeType } from '../tools'
import { CanvasPointerEvent, Tool, ToolName } from '../types'

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

    private setCursor(tool?: Tool) {
        this.interactionCanvas.cursor = tool?.cursor || 'auto'
    }

    private setDownCursor(tool?: Tool) {
        if (tool?.cursorOnPointerDown) {
            this.interactionCanvas.cursor = tool.cursorOnPointerDown
        }
    }

    private handlePointerDown(e: CanvasPointerEvent) {
        this.interactionCanvas.element.setPointerCapture(e.pointerId)
        this.setDownCursor(this.activeTool)

        if (e.button === 0) {
            this.activeTool?.onPointerDown(e)
        } else if (e.button === 1) {
            const moveTool = this.tools[ToolName.Move]
            this.setDownCursor(moveTool)
            moveTool.onPointerDown(e)
        }
    }

    private handlePointerMove(e: CanvasPointerEvent) {
        const moveTool = this.tools[ToolName.Move]
        if (e.buttons >= 4) {
            if (!moveTool.executingAction) {
                moveTool.onPointerDown(e)
                this.setDownCursor(moveTool)
            } else {
                moveTool.onPointerMove(e)
            }
        } else {
            if (moveTool.executingAction && this.activeTool !== moveTool) {
                moveTool.onPointerUp(e)
                this.setCursor(this.activeTool)
            }
            this.activeTool?.onPointerMove(e)
        }
    }

    private handlePointerUp(e: CanvasPointerEvent) {
        this.setCursor(this.activeTool)
        if (e.button === 1) {
            this.tools[ToolName.Move].onPointerUp(e)
        } else if (e.button === 0) {
            this.activeTool?.onPointerUp(e)
        }
    }

    private generateCanvasPointerEvent(e: PointerEvent): CanvasPointerEvent {
        return new CanvasPointerEvent(
            this.interactionCanvas.translationX,
            this.interactionCanvas.translationY,
            e
        )
    }

    setActiveTool(toolName: ToolName) {
        const tool = this.tools[toolName]
        if (tool === this.activeTool) return
        this.activeTool?.abortAction?.()
        this.activeTool = tool
        this.setCursor(this.activeTool)

        this.interactionCanvas.element.onpointerdown = (e) =>
            this.handlePointerDown(this.generateCanvasPointerEvent(e))

        this.interactionCanvas.element.onpointermove = (e) =>
            this.handlePointerMove(this.generateCanvasPointerEvent(e))

        this.interactionCanvas.element.onpointerup = (e) =>
            this.handlePointerUp(this.generateCanvasPointerEvent(e))

        this.interactionCanvas.element.onpointerleave = () =>
            this.activeTool?.onPointerLeave?.()

        this.emit('active-tool-change', { activeTool: toolName })
    }

    cancelActiveToolAction() {
        this.activeTool?.abortAction?.()
    }
}
