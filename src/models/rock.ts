import { BaseDrawImage, Global } from '../types';
import { Base } from './base';

export const ROCK_LARGE = 1;
export const ROCK_MEDIUM = 2;
export const ROCK_SMALL = 3;

/**
 * 陨石
 */
export class Rock extends Base {
    // 击中得分：large=50，medium=75，small=100;
    scoreValue: number;

    // 旋转速度
    rotationInc: number = 1;

    // 类型：1=large，2=medium，3=small
    scale: number;

    constructor(drawImg: BaseDrawImage, global: Global) {
        super();

        this.drawImg = drawImg;
        this.sx = drawImg.sx;
        this.sy = drawImg.sy;

        this.movingX = Math.random() * 2 + global.levelRockMaxSpeedAdjust;
        Math.random() > 0.5 && (this.movingX *= -1);
        this.movingY = Math.random() * 2 + global.levelRockMaxSpeedAdjust;
        Math.random() > 0.5 && (this.movingY *= -1);
    }

    setScale(scale: number) {
        this.scale = scale;
        if (scale === ROCK_LARGE) {
            this.scoreValue = 50;
            this.radius = 30;
        } else if (scale === ROCK_MEDIUM) {
            this.scoreValue = 75;
            this.radius = 20;
        } else if (scale === ROCK_SMALL) {
            this.scoreValue = 100;
            this.radius = 16;
        }
        this.dh = this.dw = 2 * (this.radius + 3);
    }

    update({ xMin, xMax, yMin, yMax }) {
        // 更新模型位置和旋转方向
        this.x += this.movingX;
        this.y += this.movingY;

        this.rotation += this.rotationInc;
        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
        this.sy = Math.floor(this.rotation / 2) * this.drawImg.height;

        // 判断模型是否到达边界，并做出对应的调整
        if (this.x > xMax + this.dw / 2) {
            this.x = xMin - this.dw / 2;
        } else if (this.x < xMin - this.dw / 2) {
            this.x = xMax + this.dw / 2;
        }

        if (this.y > yMax + this.dh / 2) {
            this.y = yMin - this.dh / 2;
        } else if (this.y < yMin - this.dh / 2) {
            this.y = yMax + this.dh / 2;
        }
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
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
