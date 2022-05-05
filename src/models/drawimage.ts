import { BaseDrawImage } from '../types';

/**
 * 模型图片的信息类
 */
export class DrawImage implements BaseDrawImage {
    // 图片对象
    img: HTMLImageElement;

    // 图片宽度
    width: number;

    // 图片高度
    height: number;

    // 图片截取X坐标
    sx: number;

    // 图片截取Y坐标
    sy: number;

    constructor(
        img: HTMLImageElement,
        width: number,
        height: number,
        sx: number = 0,
        sy: number = 0,
    ) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.sx = sx;
        this.sy = sy;
    }
}
