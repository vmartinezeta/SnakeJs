export class Punto {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return `P(${this.x},${this.y})`
    }

    clone() {
        return new Punto(this.x, this.y)
    }
}