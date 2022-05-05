import { BaseDrawImage } from '../types';
import { d2a } from '../utils';
import { Base } from './base';

/**
 * 导弹
 */
export class Missile extends Base {
    // 存活总时长
    life: number = 0;

    // 已存活累计时长，注：大于life，将消失
    lifeCtr: number = 0;

    constructor(drawImg: BaseDrawImage) {
        super();

        this.drawImg = drawImg;
        this.sx = drawImg.sx;
        this.sy = drawImg.sy;

        this.radius = 2;
        this.dw = drawImg.width;
        this.dh = drawImg.height;
    }

    update({ xMin, xMax, yMin, yMax }) {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x > xMax) {
            this.x = xMin - this.dw / 2;
        } else if (this.x < -this.dw / 2) {
            this.x = xMax + this.dw / 2;
        }
        if (this.y > yMax) {
            this.y = yMin - this.dh / 2;
        } else if (this.y < -this.dh / 2) {
            this.y = yMax + this.dh / 2;
        }

        return ++this.lifeCtr <= this.life;
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x + 1, this.y + 1);
        context.rotate(d2a(this.rotation - 270));
        context.drawImage(
            this.drawImg.img,
            this.sx,
            this.sy,
            this.drawImg.width,
            this.drawImg.height,
            -this.dw / 2,
            -this.dh / 2,
            this.dw,
            this.dh,
        );
        context.restore();
    }
}
