export class Pixel {
    constructor(size, origen) {
        this.size = size
        this.origen = origen
        this.origenOld = origen
    }

    update() {
        this.origenOld = this.origen.clone()
    }

    move(origen) {
        this.update()
        this.origen = origen
    }

    top() {
        this.origen.y--
    }

    left() {
        this.origen.x--
    }

    right() {
        this.origen.x++
    }

    bottom() {
        this.origen.y++
    }

    deltaX() {
        return this.origen.x * this.size
    }

    deltaY() {
        return this.origen.y * this.size
    }
}