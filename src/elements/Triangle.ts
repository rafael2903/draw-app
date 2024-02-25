import { Point } from '../types'
import { ElementProperties } from './Element'
import { Shape } from './Shape'

enum TriangleType {
    Equilateral,
    Scalene,
}

export class Triangle extends Shape {
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    private static create(
        type: TriangleType,
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) {
        const x = Math.min(startPointX, endPointX)
        const y = Math.min(startPointY, endPointY)
        const width = Math.abs(endPointX - startPointX)
        const height = Math.abs(endPointY - startPointY)

        switch (type) {
            case TriangleType.Equilateral:
                const side = Math.min(width, height)
                return new Triangle(x, y, side, side, elementProperties)
            case TriangleType.Scalene:
                return new Triangle(x, y, width, height, elementProperties)
        }
    }

    static fromTwoPoints(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) {
        return Triangle.create(
            TriangleType.Scalene,
            startPointX,
            startPointY,
            endPointX,
            endPointY,
            elementProperties
        )
    }

    static equilateralFromTwoPoints(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) {
        return Triangle.create(
            TriangleType.Equilateral,
            startPointX,
            startPointY,
            endPointX,
            endPointY,
            elementProperties
        )
    }

    clone() {
        return new Triangle(this.x, this.y, this.width, this.height, this)
    }

    get path() {
        const leftBottomCorner = new Point(this.x, this.y + this.height)
        const topCenter = new Point(this.x + this.width / 2, this.y)
        const rightBottomCorner = new Point(
            this.x + this.width,
            this.y + this.height
        )
        const path = new Path2D()
        path.moveTo(leftBottomCorner.x, leftBottomCorner.y)
        path.lineTo(topCenter.x, topCenter.y)
        path.lineTo(rightBottomCorner.x, rightBottomCorner.y)
        path.closePath()
        return path
    }
}
