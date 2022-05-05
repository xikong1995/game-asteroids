import { Base } from './base';
import { rnd } from '../utils';
import { BaseDrawImage, Global } from '../types';

/**
 * 飞碟
 */
export class Saucer extends Base {
    // 被击中得分
    scoreValue: number = 300;

    // 旋转速度
    rotationInc: number = 4;

    // 发射导弹的概率
    fireRate: number = 0;

    // 导弹的速度
    missileSpeed: number = 0;

    // 发射导弹的间隔
    fireDelay: number = 0;

    // 发射导弹的计时
    fireDelayCount: number = 0;

    constructor(drawImg: BaseDrawImage, global: Global) {
        super();

        this.drawImg = drawImg;
        this.sx = drawImg.sx;
        this.sy = drawImg.sy;

        this.radius = 15;
        this.dh = this.dw = 2 * (this.radius + 3);

        this.fireRate = global.levelSaucerFireRate;
        this.fireDelay = global.levelSaucerFireDelay;
        this.missileSpeed = global.levelSaucerMissileSpeed;

        this.movingX = global.levelSaucerSpeed;
        Math.random() > 0.5 && (this.movingX *= -1);
        this.movingY = Math.random() * 2;
        Math.random() > 0.5 && (this.movingY *= -1);

        this.x = Math.random() > 0.5 ? global.xMax + this.dw / 2 : -this.dw / 2;
        this.y = rnd(0, global.yMax);
    }

    update({ xMin, xMax, yMin, yMax }) {
        // 更新飞碟发射导弹时间
        this.fireDelayCount += 1;
        if (
            Math.floor(Math.random() * 100) <= this.fireRate &&
            this.fireDelayCount > this.fireDelay
        ) {
            this.fireDelayCount = 0;
        }

        // 更新模型位置和旋转方向
        this.x += this.movingX;
        this.y += this.movingY;

        this.rotation += this.rotationInc;
        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
        this.sy = Math.floor(this.rotation / 4) * this.drawImg.height;

        // 判断模型是否到达边界，并做出对应的调整
        let remove = false;
        if (this.movingX > xMin && this.x > xMax + this.dw / 2) {
            remove = true;
        } else if (this.movingX < xMin && this.x < xMin - this.dw / 2) {
            remove = true;
        }

        if (this.y > yMax + this.dh / 2 || this.y < yMin - this.dh / 2) {
            this.movingY *= -1;
        }

        return !remove;
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
