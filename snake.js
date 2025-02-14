/*Autor:Hector de Leon*/
/*Refactorizado por Víctor Martinez*/
import { PhysicsBody } from "./PhysicsBody.js";
const PIXEL_SIZE = 10
const WIDTH = 300
const HEIGHT = 300

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function () {
        this.sound.play();
    }

    this.stop = function () {
        this.sound.pause();
    }
}


class Game {
    snake = [];
    food = null;
    director = null;
    direction = 2;
    canvas = null;
    tiempoInicio = null

    head = new Image();
    tail = new Image();
    cookie = new Image();
    lose = new Image();
    scream = new sound("media/scream.mp3");

    isLost = false;
    detailDirection = ["", "Arriba", "Derecha", "Abajo", "Izquierda"];

    constructor(txtButton, txtState, txtTiempo, canvas) {
        this.txtButton = txtButton;
        this.txtState = txtState;
        this.txtTiempo = txtTiempo
        this.canvas = canvas;
        canvas.width = WIDTH
        canvas.height = HEIGHT

        this.tiempoInicio = new Date()

        this.ctx = this.canvas.getContext("2d");

        this.head.src = "media/bola.png";
        this.cookie.src = "media/cookie.png";
        this.tail.src = "media/bola2.png";
        this.lose.src = "media/perdiste.jpg";

    }

    init() {
        this.snake.push(new PhysicsBody(15, 15, PIXEL_SIZE, PIXEL_SIZE));

        document.addEventListener("keyup", (e) => {
            this.printKey(e.key);
            switch (e.key) {
                case 'ArrowUp':
                    if (this.direction != 3)
                        this.direction = 1;
                    break;
                case 'ArrowRight':
                    if (this.direction != 4)
                        this.direction = 2;
                    break;
                case 'ArrowDown':
                    if (this.direction != 1)
                        this.direction = 3;
                    break;
                case 'ArrowLeft':
                    if (this.direction != 2)
                        this.direction = 4;
                    break;

            }
        });

        this.director = this.timeline()
    }

    rellenarDecena(numero, defaultValue = "0") {
        if (numero < 10) {
            return defaultValue + numero
        }
        return numero
    }

    formatearTiempo(milisegundos) {
        let horas = parseInt(milisegundos / 1000 / 60 / 60)
        milisegundos -= horas * 60 * 60 * 1000
        let minutos = parseInt(milisegundos / 1000 / 60)
        milisegundos -= minutos * 60 * 1000
        let segundos = milisegundos / 1000
        return `${this.rellenarDecena(horas)}:${this.rellenarDecena(minutos)}:${this.rellenarDecena(segundos.toFixed(0))}`
    }

    actualizarTiempo = () => {
        const ahora = new Date()
        const diferencia = ahora.getTime() - this.tiempoInicio.getTime()
        this.txtTiempo.value = this.formatearTiempo(diferencia)
    }

    timeline() {
        let interval = setInterval(async () => {
            this.actualizarTiempo()

            this.rules();
            if (!this.isLost) {
                this.next();
                this.show();
            } else {
                clearInterval(interval)
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                if (!this.estaFueraJuego()) {
                    await this.delay(500)
                    interval = setInterval(() => {
                        const pixeles = this.snake.splice(1, 1)
                        if (pixeles) {
                            const { origen } = pixeles[0]
                            this.snake[0].move(origen)
                        }

                        this.show()
                        if (this.snake.length === 1) {
                            clearInterval(interval)
                            this.ctx.drawImage(this.lose, 0, 0);
                        }
                    }, 100)
                } else {
                    this.ctx.drawImage(this.lose, 0, 0);
                }
            }
        }, 100);

        return () => clearInterval(interval)
    }

    delay(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    next() {
        this.printDirection();

        // obtenemos comida
        if (this.food == null)
            this.getFood();

        // mover la vibora automaticamente
        this.snake.map((square) => square.update());

        // nueva posición de cabeza
        switch (this.direction) {
            case 1:
                this.snake[0].top();
                break;
            case 2:
                this.snake[0].right();
                break;
            case 3:
                this.snake[0].bottom();
                break;
            case 4:
                this.snake[0].left();
                break;
        }

        this.snake.map((square, index, snake_) => {
            if (index > 0) {
                const { x0, y0 } = snake_[index - 1]
                square.move(x0, y0)
            }
        })

        if (this.food != null)
            this.isEating();

    }

    show() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.map((square, index) => {
            if (index == 0) {
                this.ctx.drawImage(this.head, square.deltaX(), square.deltaY());
            } else {
                this.ctx.drawImage(this.tail, square.deltaX(), square.deltaY());
            }
        });

        if (this.food != null) {
            this.ctx.drawImage(this.cookie, this.food.deltaX(), this.food.deltaY());
        }
    }

    rules() {
        //regla 1, colisión
        const snake = this.snake
        for (let i = 1; i < this.snake.length; i++) {
            if (snake[0].touching(snake[i])) {
                this.isLost = true;
            }
        }

        //regla 2, salir de pantalla
        if (this.estaFueraJuego()) {
            this.isLost = true;
        }
    }

    estaFueraJuego() {
        const { x, y } = this.snake[0]
        const x1 = WIDTH / PIXEL_SIZE
        const y1 = HEIGHT / PIXEL_SIZE
        return x >= x1
            || x < 0
            || y >= y1 || y < 0
    }

    async isEating() {
        const [cabeza] = this.snake
        if (cabeza.touching(this.food)) {
            this.food = null;
            this.scream.play();
            const { x0, y0 } = this.snake[this.snake.length - 1];
            this.snake.push(new PhysicsBody(x0, y0, PIXEL_SIZE, PIXEL_SIZE));
            this.director()
            // await this.delay(1)
            this.director = this.timeline()
        }
    }

    collide(snake, galleta) {
        for (const cuadro of snake) {
            if (galleta.touching(cuadro)) {
                return true
            }
        }
        return false
    }

    createCookie() {
        const snake = this.snake
        let x = Math.floor( Math.random() * 30)
        let y = Math.floor( Math.random() * 30)
        const galleta = new PhysicsBody(x, y, PIXEL_SIZE, PIXEL_SIZE)
        const tiempoInicio = new Date()
        return new Promise((resolve, reject) => {
            while (this.collide(snake, galleta)) {
                x = Math.floor( Math.random() * 30)
                y = Math.floor( Math.random() * 30)
                galleta.x = x
                galleta.y = y
                const hoy = new Date()
                const tiempo = hoy - tiempoInicio
                if (tiempo > 1000) {
                    return reject("ERROR: Completo el mundo del juego")
                }
            }
            resolve(galleta)
        })
    }

    async getFood() {
        const cookie = await this.createCookie()
        this.food = cookie
    }

    printDirection() {
        this.txtState.value = this.detailDirection[this.direction];
    }

    printKey(text) {
        this.txtButton.value = text;
    }
}


var game = new Game(document.getElementById("txtButton"),
    document.getElementById("txtState"),
    document.getElementById("reloj"),
    document.getElementById("canvas"));
game.init();