import {Rectangle} from "./Rectangle.js"

export class PhysicsBody extends Rectangle{
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.enabled = true        
    }

    touching(body) {
        if (!(body instanceof PhysicsBody)) {
            throw new TypeError("Deben ser cuerpos de fisica.")
        }

        return this.enabled && this.x == body.x && this.y === body.y
    }

    newInstance() {
        return new PhysicsBody(this.x, this.y, this.width, this.height)
    }
}