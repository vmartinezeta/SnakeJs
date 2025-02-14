export class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x
        this.y = y
        this.x0 = x
        this.y0 = y
        this.width = width
        this.height = height
    }

    update() {
        this.x0 = this.x
        this.y0 = this.y
    }

    move(x, y) {
        this.update()
        this.x = x
        this.y = y     
    }

    top() {
        this.y--
    }

    left() {
        this.x--
    }

    right() {
        this.x++
    }

    bottom() {
        this.y++
    }

    deltaX() {
        return this.x * this.width
    }

    deltaY() {
        return this.y * this.height
    }
}