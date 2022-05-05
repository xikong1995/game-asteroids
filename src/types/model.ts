import { Global } from '.';

export interface BaseDrawImage {
    img: HTMLImageElement;

    width: number;

    height: number;

    sx: number;

    sy: number;
}

export interface BaseModel {
    // 图片信息
    drawImg: BaseDrawImage;

    // 模型半径，用于碰撞检测
    radius: number;

    sx: number;

    sy: number;

    width: number;

    height: number;

    dx: number;

    dy: number;

    dw: number;

    dh: number;

    movingX: number;

    movingY: number;

    halfWidth: number;

    halfHeight: number;

    x: number;

    y: number;

    rotation: number;

    hit: boolean;

    update(global: Global): boolean | void;

    render(context: CanvasRenderingContext2D): void;

    outOfRect(
        left: number,
        right: number,
        top: number,
        bottom: number,
    ): boolean;

    checkColl(other: BaseModel): boolean;
}

export interface ImagesObj {
    [key: string]: HTMLImageElement;
}

export interface SoundsObj {
    [key: string]: AudioBuffer;
}

export interface ImageLoadObj {
    img: HTMLImageElement;
    url: string;
}
