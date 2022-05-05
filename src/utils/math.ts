/**
 * 角度转弧度
 *
 * @param degree 角度
 * @returns 弧度
 */
export function d2a(degree: number): number {
    return (degree / 180) * Math.PI;
}

/**
 * 弧度转角度
 *
 * @param angle 弧度
 * @returns 角度
 */
export function a2d(angle: number): number {
    return (angle / Math.PI) * 180;
}

/**
 * 获取范围m~n的随机值
 *
 * @param n 范围左区间
 * @param m 范围右区间
 * @returns 随机值
 */
export function rnd(n: number, m: number): number {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}
