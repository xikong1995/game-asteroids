import { ImagesObj } from '../types';

const GLOWSHADOWBLUR = 8;
const ENEMY_SHIP = 'rgb(200,200,250)';
const GREEN_LASER = 'rgb(120,255,120)';
const GREEN_LASER_DARK = 'rgb(50,255,50)';

/**
 * 预渲染服务
 *
 * 生成玩家飞船与飞碟的导弹
 */
export class Prerenderer {
    images: ImagesObj;

    renderers: Function[];

    constructor() {
        this.images = {};
        this.renderers = [];

        this.addRenderer(function (canvas) {
            const w = 2;
            const h = 6;
            canvas.width = w + GLOWSHADOWBLUR * 2;
            canvas.height = h + GLOWSHADOWBLUR * 2;
            const context = canvas.getContext('2d');
            context.shadowBlur = GLOWSHADOWBLUR;
            context.translate(canvas.width * 0.5, canvas.height * 0.5);
            context.shadowColor = context.fillStyle = GREEN_LASER_DARK;
            renderDiamond(context, w - 1, h - 1);
            context.fill();
            context.shadowColor = context.fillStyle = GREEN_LASER;
            renderDiamond(context, w, h);
            context.fill();

            const img = new Image();
            img.src = canvas.toDataURL('image/png');
            return img;
        }, 'bullet');

        this.addRenderer(function (canvas) {
            const length = 4;
            canvas.width = canvas.height = length * 2 + GLOWSHADOWBLUR * 2;
            const context = canvas.getContext('2d');
            context.shadowBlur = GLOWSHADOWBLUR;
            context.shadowColor = context.fillStyle = ENEMY_SHIP;
            context.translate(canvas.width * 0.5, canvas.height * 0.5);
            context.beginPath();
            context.arc(0, 0, length - 1, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            renderCorners(context, length);
            context.fill();

            const img = new Image();
            img.src = canvas.toDataURL('image/png');
            return img;
        }, 'enemybullet');
    }

    addRenderer(fn, name) {
        this.renderers[name] = fn;
    }

    execute() {
        const cvs = document.createElement('canvas');
        for (const name in this.renderers) {
            this.images[name] = this.renderers[name].call(this, cvs);
        }
    }
}

function renderDiamond(context: CanvasRenderingContext2D, k, j) {
    context.beginPath();
    context.moveTo(0, j);
    context.lineTo(k, 0);
    context.lineTo(0, -j);
    context.lineTo(-k, 0);
    context.closePath();
}

function renderCorners(context: CanvasRenderingContext2D, l) {
    context.beginPath();
    context.moveTo(l * 2, 0);
    for (let j = 0; j < 7; j++) {
        context.rotate(Math.PI / 4);
        if (j % 2 === 0) {
            context.lineTo(((l * 2) / 0.525731) * 0.200811, 0);
        } else {
            context.lineTo(l * 2, 0);
        }
    }
    context.closePath();
}
