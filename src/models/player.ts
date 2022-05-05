import { BaseDrawImage } from '../types';
import { d2a } from '../utils';
import { Base } from './base';

/**
 * 玩家
 */
export class Player extends Base {
    // 导弹的速度
    missileSpeed: number = 5;

    // 发射导弹的间隔
    missileFrameDelay: number = 10;

    // 发射导弹的计时
    missileFrameCount: number = 0;

    // 最大速度
    maxVelocity: number = 2;

    // 旋转速度
    rotationalVelocity: number = 4;

    // 冲刺加速度
    thrustAcceleration: number = 0.03;

    // 表示玩家是否按下向上键
    thrust: boolean = false;

    // 透明度
    alpha: number = 1;

    constructor(drawImg: BaseDrawImage) {
        super();

        this.drawImg = drawImg;
        this.sx = drawImg.sx;
        this.sy = drawImg.sy;

        this.radius = 10;
        this.dh = this.dw = 2 * (this.radius + 3);
    }

    update({ xMin, xMax, yMin, yMax }) {
        // 更新飞碟发射导弹时间
        this.missileFrameCount += 1;

        // 更新模型位置和旋转方向
        this.x += this.movingX;
        this.y += this.movingY;

        let calRotation = this.rotation - 270;
        if (calRotation > 360) {
            calRotation -= 360;
        } else if (calRotation < 0) {
            calRotation += 360;
        }
        this.sy = Math.floor(calRotation / 4) * this.drawImg.height;

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
        if (this.thrust) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(d2a(this.rotation - 270));
            context.globalAlpha = 0.5 + Math.random() * 0.5;
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = 'rgb(25,125,255)';
            context.beginPath();
            context.moveTo(-5, 8);
            context.lineTo(5, 8);
            context.lineTo(0, 18 + Math.random() * 6);
            context.closePath();
            context.fill();
            context.restore();
        }
        context.save();
        context.globalAlpha = this.alpha;
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
