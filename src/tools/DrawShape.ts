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
import { Point, Tool } from '../types'

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

    onPointerDown(e: PointerEvent) {
        this.drawing = true
        this.startPoint = new Point(e.x, e.y)
    }

    onPointerMove(e: PointerEvent) {
        if (!this.drawing) return
        const { x, y } = this.startPoint!
        if (e.shiftKey) {
            this.currentPath = this.shapeFactory.shifted(x, y, e.x, e.y)
        } else {
            this.currentPath = this.shapeFactory.default(x, y, e.x, e.y)
        }
        this.interactionCanvas.replaceElements(this.currentPath)
    }

    onPointerUp() {
        if (!this.drawing) return
        this.drawing = false
        if (!this.currentPath) return
        this.elementsCanvas.addElementWithTranslation(this.currentPath)
        this.interactionCanvas.clear()
    }

    abortAction() {
        this.drawing = false
        this.interactionCanvas.clear()
    }
}
