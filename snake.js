/*Autor:Hector de Leon*/
/*Refactorizado por Víctor Martinez*/
import { Pixel } from "./Pixel.js";
import { Punto } from "./Punto.js";

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

    head = new Image();
    tail = new Image();
    cookie = new Image();
    lose = new Image();
    scream = new sound("media/scream.mp3");

    isLost = false;
    detailDirection = ["", "Arriba", "Derecha", "Abajo", "Izquierda"];

    constructor(txtButton, txtState, canvas) {
        this.txtButton = txtButton;
        this.txtState = txtState;
        this.canvas = canvas;

        this.ctx = this.canvas.getContext("2d");

        this.head.src = "media/bola.png";
        this.cookie.src = "media/cookie.png";
        this.tail.src = "media/bola2.png";
        this.lose.src = "media/perdiste.jpg";
    }

    init() {
        this.snake.push(new Pixel(10, new Punto(15, 15)));

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

        this.director = setInterval(() => {
            this.rules();
            if (!this.isLost) {
                this.next();
                this.show();
            } else {
                clearInterval(this.director);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(this.lose, 0, 0);
            }
        }, 100);
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
                const { origenOld } = snake_[index - 1]
                square.move(origenOld)
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
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[0].origen.toString() === this.snake[i].origen.toString()) {
                this.isLost = true;
            }
        }

        //regla 2, salir de pantalla
        if (this.estaFuera(30, 30)) {
            this.isLost = true;
        }
    }

    estaFuera(x, y) {
        const {origen} = this.snake[0]
        return origen.x >= x 
        || origen.x < 0 
        || origen.y >= y || origen.y < 0
    }

    isEating() {
        const {origen:p1} = this.snake[0]
        const {origen:p2} = this.food
        if (p1.toString() === p2.toString()) {
            this.food = null;
            this.scream.play();
            const {origenOld} = this.snake[this.snake.length - 1];
            this.snake.push(new Pixel(10, origenOld));
        }
    }

    getFood() {
        const x = Math.floor(Math.random() * 30);
        const y = Math.floor(Math.random() * 30);
        this.food = new Pixel(10, new Punto(x, y));
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
    document.getElementById("canvas"));
game.init();