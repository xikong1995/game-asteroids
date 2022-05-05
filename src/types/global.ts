export interface Global {
    // 陨石的数量。
    levelRockNumber?: number;

    // 陨石的最大速度。
    levelRockMaxSpeedAdjust?: number;

    // 同时出现的飞碟数量。
    levelSaucerMax?: number;

    // 飞碟出现几率的百分比。
    levelSaucerOccurrenceRate?: number;

    // 飞碟的速度。
    levelSaucerSpeed?: number;

    // 飞碟发射导弹的间隔。
    levelSaucerFireDelay?: number;

    // 飞碟向玩家发射导弹的几率的百分比。
    levelSaucerFireRate?: number;

    // 飞碟导弹的速度。
    levelSaucerMissileSpeed?: number;

    // 游戏区域边界
    yMax: number;
    yMin: number;
    xMax: number;
    xMin: number;
}
