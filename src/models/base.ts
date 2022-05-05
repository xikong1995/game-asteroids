import { Global, BaseModel, BaseDrawImage } from '../types';

/**
 * 模型基类
 */
export class Base implements BaseModel {
    // 图片信息
    drawImg: BaseDrawImage;

    // 模型半径，用于碰撞检测
    radius: number = 0;

    sx: number = 0;

    sy: number = 0;

    // 模型宽度
    width: number = 0;

    // 模型高度
    height: number = 0;

    dx: number = 0;

    dy: number = 0;

    // 模型绘制在画布上宽度
    dw: number = 0;

    // 模型绘制在画布上高度
    dh: number = 0;

    // X轴方向移动距离
    movingX: number = 0;

    // Y轴方向移动距离
    movingY: number = 0;

    // 1/2 模型宽度
    halfWidth: number = 0;

    // 1/2 模型高度
    halfHeight: number = 0;

    // 模型起始点的X轴坐标
    x: number = 0;

    // 模型起始点的Y轴坐标
    y: number = 0;

    // 模型旋转角度
    rotation: number = 0;

    // 是否被击中
    hit: boolean;

    constructor() {}

    /**
     * 更新模型状态，包括位置、形状等等
     * @param global 全局对象
     */
    update(global: Global): boolean | void {}

    /**
     * 渲染模型状态
     * @param context 画布上下文
     */
    render(context: CanvasRenderingContext2D): void {}

    /**
     * 是否超出边界
     * @param left 左边界
     * @param right 右边界
     * @param top 上边界
     * @param bottom 下边界
     */
    outOfRect(
        left: number,
        right: number,
        top: number,
        bottom: number,
    ): boolean {
        if (
            this.x < left ||
            this.x > right ||
            this.y < top ||
            this.y > bottom
        ) {
            return true;
        }
        return false;
    }

    /**
     * 碰撞检测
     * @param other 检测对象
     * @returns 是否碰撞
     */
    checkColl(other: Base): boolean {
        if (
            Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) >
            Math.pow(this.radius + other.radius, 2)
        ) {
            return false;
        }
        return true;
    }
}
