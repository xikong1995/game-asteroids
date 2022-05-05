import { Base } from './base';

/**
 * 碎片
 */
export class Particle extends Base {
    // 存活总时长
    life: number = 0;

    // 已存活累计时长，注：大于life，将消失
    lifeCtr: number = 0;

    constructor() {
        super();

        this.life = Math.floor(Math.random() * 30 + 30);

        this.dx = Math.random() * 3;
        if (Math.random() < 0.5) {
            this.dx *= -1;
        }
        this.dy = Math.random() * 3;
        if (Math.random() < 0.5) {
            this.dy *= -1;
        }
    }

    update({ xMin, xMax, yMin, yMax }) {
        this.x += this.dx;
        this.y += this.dy;

        if (this.outOfRect(xMin, xMax, yMin, yMax)) {
            return false;
        }

        return ++this.lifeCtr <= this.life;
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
        context.strokeStyle = '#ffffff';
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(1, 1);
        context.stroke();
        context.closePath();
        context.restore();
    }
}
