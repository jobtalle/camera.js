import {Vector2} from "../math/vector2.js";

export class Camera {
    static #ZOOM_LIMITS = new Vector2(4, 512);
    static #ZOOM_SPEED = .15;

    #shift = new Vector2(0, -4);
    #zoom = 64;
    #size = new Vector2();
    #dragging = false;
    #mouse = new Vector2();

    constructor(canvas) {
        canvas.addEventListener("mousedown", event => {
            this.#mouse.x = event.clientX;
            this.#mouse.y = event.clientY;
            this.#dragging = true;
        });

        canvas.addEventListener("mousemove", event => {
            if (this.#dragging) {
                const dx = event.clientX - this.#mouse.x;
                const dy = event.clientY - this.#mouse.y;

                this.#shift.x -= dx / this.#zoom;
                this.#shift.y -= dy / this.#zoom;
            }

            this.#mouse.x = event.clientX;
            this.#mouse.y = event.clientY;
        });

        canvas.addEventListener("mouseup", () => {
            this.#dragging = false;
        });

        window.addEventListener("wheel", event => {
            const zoom = this.#zoom;

            this.#zoom = Camera.#ZOOM_LIMITS.clamp(
                this.#zoom * (1 - Math.sign(event.deltaY) * Camera.#ZOOM_SPEED));

            const scale = (this.#zoom - zoom) / (this.#zoom * zoom);

            this.#shift.x += (this.#mouse.x - this.#size.x * .5) * scale;
            this.#shift.y += (this.#mouse.y - this.#size.y * .5) * scale;
        });
    }

    toContext(context) {
        context.translate(this.#size.x * .5, this.#size.y * .5);
        context.scale(this.#zoom, this.#zoom);
        context.translate(-this.#shift.x, -this.#shift.y);
    }

    resize(width, height) {
        this.#size.x = width;
        this.#size.y = height;
    }
}