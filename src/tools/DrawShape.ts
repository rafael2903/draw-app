import { Canvas } from '../Canvas'
import {
    Circle,
    ElementProperties,
    Ellipse,
    Line,
    Rectangle,
    Shape,
    Square,
    Triangle,
} from '../elements'
import { CanvasPointerEvent, Point, Tool } from '../types'

export enum ShapeType {
    Line,
    Ellipse,
    Rectangle,
    Triangle,
}

interface ShapeFactory {
    default: (
        x: number,
        y: number,
        x2: number,
        y2: number,
        elementProperties?: ElementProperties
    ) => Shape
    shifted: ShapeFactory['default']
}

export class DrawShape implements Tool {
    readonly cursor = 'crosshair'
    private drawing = false
    private startPoint: Point | null = null
    private currentPath?: Shape
    private shapeFactory: ShapeFactory

    private static shapes: Record<ShapeType, ShapeFactory> = {
        [ShapeType.Line]: {
            default: (x: number, y: number, x2: number, y2: number) =>
                new Line(x, y, x2, y2),
            shifted: Line.createNearStepAngle,
        },
        [ShapeType.Ellipse]: {
            default: Ellipse.fromTwoPoints,
            shifted: Circle.fromTwoPoints,
        },
        [ShapeType.Rectangle]: {
            default: Rectangle.fromTwoPoints,
            shifted: Square.fromTwoPoints,
        },
        [ShapeType.Triangle]: {
            default: Triangle.fromTwoPoints,
            shifted: Triangle.equilateralFromTwoPoints,
        },
    }

    constructor(
        shape: ShapeType,
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {
        this.shapeFactory = DrawShape.shapes[shape]
    }

    get executingAction() {
        return this.drawing
    }

    onPointerDown(e: CanvasPointerEvent) {
        this.drawing = true
        this.startPoint = new Point(e.canvasX, e.canvasY)
    }

    onPointerMove(e: CanvasPointerEvent) {
        if (!this.drawing || !this.startPoint) return
        if (e.shiftKey) {
            this.currentPath = this.shapeFactory.shifted(
                this.startPoint.x,
                this.startPoint.y,
                e.canvasX,
                e.canvasY
            )
        } else {
            this.currentPath = this.shapeFactory.default(
                this.startPoint.x,
                this.startPoint.y,
                e.canvasX,
                e.canvasY
            )
        }
        this.interactionCanvas.replaceElements(this.currentPath)
    }

    onPointerUp() {
        if (!this.drawing) return
        this.drawing = false
        if (!this.currentPath) return
        this.elementsCanvas.addElement(this.currentPath)
        this.interactionCanvas.removeAll()
    }

    abortAction() {
        this.drawing = false
        this.interactionCanvas.removeAll()
    }
}
