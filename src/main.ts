import 'normalize.css';
import './assets/css/main';

import {
    GAME_STATE_INIT,
    GAME_STATE_TITLE,
    GAME_STATE_NEW_GAME,
    GAME_STATE_NEW_LEVEL,
    GAME_STATE_PLAYER_START,
    GAME_STATE_PLAY_LEVEL,
    GAME_STATE_PLAYER_DIE,
    GAME_STATE_GAME_OVER,
} from './config/constant';
import {
    Missile,
    Particle,
    Player,
    Rock,
    Saucer,
    Background,
    DrawImage,
    ROCK_LARGE,
    ROCK_MEDIUM,
    ROCK_SMALL,
} from './models';
import { SoundLoad, Prerenderer } from './service';
import { Global } from './types';
import { d2a, rnd, loadImages } from './utils';

function canvasApp() {
    const canvasBg = document.getElementById('canvas-bg') as HTMLCanvasElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvasBg || !canvasBg.getContext || !canvas || !canvas.getContext) {
        return;
    }
    const contextBg: CanvasRenderingContext2D = canvasBg.getContext('2d');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    if (!contextBg || !context) {
        return;
    }
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const global: Global = {
        // 画布边界
        xMin: 0,
        xMax: canvasWidth,
        yMin: 0,
        yMax: canvasHeight,

        // 陨石相关
        levelRockMaxSpeedAdjust: 1,
        levelRockNumber: 1,

        // 飞碟相关
        levelSaucerMax: 1,
        levelSaucerOccurrenceRate: 25,
        levelSaucerSpeed: 1,
        levelSaucerFireDelay: 300,
        levelSaucerFireRate: 30,
        levelSaucerMissileSpeed: 1,
    };

    // 游戏当前状态
    let currentGameState = 0;
    // 游戏当前状态执行函数
    let currentGameStateFunction = null;
    // 游戏开始 显示
    let titleStarted = false;
    // 游戏结束 显示
    let gameOverStarted = false;
    // 游戏得分
    let score = 0;
    // 游戏等级
    let level = 0;
    // 玩家生命
    let playerShips = 30;
    // 玩家分数每达到 10000 就奖励一条生命
    const extraShipAtEach = 10000;
    // 玩家已奖励生命数
    let extraShipsEarned = 0;

    // 背景
    let background: Background;
    // 玩家
    let player: Player;
    // 玩家导弹集合
    let playerMissiles: Missile[] = [];
    // 陨石集合
    let rocks: Rock[] = [];
    // 飞碟集合
    let saucers: Saucer[] = [];
    // 飞碟导弹集合
    let saucerMissiles: Missile[] = [];
    // 碎片集合
    let particles: Particle[] = [];
    // 键盘状态集合
    const keyPressList: boolean[] = [];

    // 图片和声音资源
    const backgroundImg = new Image();
    const playerImg = new Image();
    const enemyshipImg = new Image();
    const asteroidImgs = [];
    asteroidImgs[0] = new Image();
    asteroidImgs[1] = new Image();
    asteroidImgs[2] = new Image();
    asteroidImgs[3] = new Image();

    let soundLoad: SoundLoad;

    let prerenderer: Prerenderer;

    /**
     *  切换游戏状态
     * @param newState 游戏状态
     */
    function switchGameState(newState: number) {
        currentGameState = newState;

        switch (currentGameState) {
            case GAME_STATE_TITLE:
                currentGameStateFunction = gameStateTitle;
                break;
            case GAME_STATE_INIT:
                currentGameStateFunction = gameStateInit;
                break;
            case GAME_STATE_NEW_GAME:
                currentGameStateFunction = gameStateNewGame;
                break;
            case GAME_STATE_NEW_LEVEL:
                currentGameStateFunction = gameStateNewLevel;
                break;
            case GAME_STATE_PLAYER_START:
                currentGameStateFunction = gameStatePlayerStart;
                break;
            case GAME_STATE_PLAY_LEVEL:
                currentGameStateFunction = gameStatePlayeLevel;
                break;
            case GAME_STATE_PLAYER_DIE:
                currentGameStateFunction = gameStatePlayerDie;
                break;
            case GAME_STATE_GAME_OVER:
                currentGameStateFunction = gameStateGameOver;
                break;
            default:
        }
    }

    /**
     * 绘制背景和文字
     */
    function gameStateTitle() {
        if (!titleStarted) {
            clearBackground();

            context.textBaseline = 'top';

            context.fillStyle = '#0099FF';
            context.font = '40px sans-serif';
            const gameName = 'Base Asteroids';
            context.fillText(
                gameName,
                canvasWidth / 2 - gameName.length * 10,
                150,
            );

            context.fillStyle = '#ffffff';
            context.font = '20px sans-serif';
            const gameTip = 'Press Space To Play';
            context.fillText(
                gameTip,
                canvasWidth / 2 - gameTip.length * 5,
                300,
            );

            titleStarted = true;
        } else if (keyPressList[32]) {
            switchGameState(GAME_STATE_INIT);
            titleStarted = false;
        }
    }

    /**
     * 启动游戏
     */
    function gameStateInit() {
        loadImages(
            [
                {
                    img: playerImg,
                    url: './images/player.png',
                },
                {
                    img: enemyshipImg,
                    url: './images/enemyship1.png',
                },
                {
                    img: asteroidImgs[0],
                    url: './images/asteroid1.png',
                },
                {
                    img: asteroidImgs[1],
                    url: './images/asteroid2.png',
                },
                {
                    img: asteroidImgs[2],
                    url: './images/asteroid3.png',
                },
                {
                    img: asteroidImgs[3],
                    url: './images/asteroid4.png',
                },
            ],
            function () {
                switchGameState(GAME_STATE_NEW_GAME);
            },
        );

        soundLoad = new SoundLoad();
        soundLoad.loadSound('./sounds/laser.mp3', 'laser');
        soundLoad.loadSound('./sounds/enemybomb.mp3', 'enemyLaser');
        soundLoad.loadSound('./sounds/bigboom.mp3', 'bigboom');
        soundLoad.loadSound('./sounds/explosion1.mp3', 'asteroidBoom1');
        soundLoad.loadSound('./sounds/explosion2.mp3', 'asteroidBoom2');
        soundLoad.loadSound('./sounds/explosion3.mp3', 'asteroidBoom3');
        soundLoad.loadSound('./sounds/explosion4.mp3', 'asteroidBoom4');

        prerenderer = new Prerenderer();
        prerenderer.execute();
    }

    /**
     * 设置新游戏所有的默认选项。重新初始化所有保存显示对象的数组，
     * 将游戏级别重置为0，将游戏得分设置为0。
     */
    function gameStateNewGame() {
        level = 0;
        score = 0;
        playerShips = 30;
        extraShipsEarned = 0;

        player = new Player(new DrawImage(playerImg, 64, 64));

        clearBackground();
        renderScoreBoard();

        switchGameState(GAME_STATE_NEW_LEVEL);
    }

    /**
     * 开始新的关卡，游戏级别的数值加1，
     * 设置“游戏难度旋钮”的值来控制难度。
     */
    function gameStateNewLevel() {
        rocks = [];
        saucers = [];
        playerMissiles = [];
        saucerMissiles = [];
        particles = [];

        level += 1;

        global.levelRockNumber = level + 3;
        global.levelRockMaxSpeedAdjust = level * 0.25;
        if (global.levelRockMaxSpeedAdjust > 3) {
            global.levelRockMaxSpeedAdjust = 3;
        }

        global.levelSaucerMax = 1 + Math.floor(level / 10);
        if (global.levelSaucerMax > 5) {
            global.levelSaucerMax = 5;
        }
        global.levelSaucerOccurrenceRate = 10 + 3 * level;
        if (global.levelSaucerOccurrenceRate > 35) {
            global.levelSaucerOccurrenceRate = 35;
        }
        global.levelSaucerSpeed = 1 + 0.5 * level;
        if (global.levelSaucerSpeed > 5) {
            global.levelSaucerSpeed = 5;
        }
        global.levelSaucerFireDelay = 120 - 10 * level;
        if (global.levelSaucerFireDelay < 20) {
            global.levelSaucerFireDelay = 20;
        }
        global.levelSaucerFireRate = 20 + 3 * level;
        if (global.levelSaucerFireRate < 50) {
            global.levelSaucerFireRate = 50;
        }
        global.levelSaucerMissileSpeed = 1 + 0.2 * level;
        if (global.levelSaucerMissileSpeed > 4) {
            global.levelSaucerMissileSpeed = 4;
        }

        // 创建陨石
        for (let i = 0; i < global.levelRockNumber; i++) {
            const type = rnd(0, 3);
            const rock = new Rock(
                new DrawImage(asteroidImgs[type], 64, 64),
                global,
            );
            rock.setScale(ROCK_LARGE);
            rock.x = Math.floor(Math.random() * 50);
            rock.y = Math.floor(Math.random() * 50);
            rocks.push(rock);
        }

        resetPlayer();

        switchGameState(GAME_STATE_PLAYER_START);
    }

    /**
     * 设置玩家飞船淡入屏幕，即透明度从0到1。一旦完成，就进入游戏关卡。
     */
    function gameStatePlayerStart() {
        clearBackground();

        if (player.alpha < 1) {
            player.alpha += 0.01;
        } else {
            player.alpha = 1;
            switchGameState(GAME_STATE_PLAY_LEVEL);
        }

        updatePlayer();
        updateRocks();
        updateSaucers();
        updateSaucerMissiles();

        renderPlayerShip();
        renderRocks();
        renderSaucers();
        renderSaucerMissiles();

        renderScoreBoard();
    }

    /**
     * 控制游戏关卡。调用update()和render()函数，
     * 同时根据用户输入的按键值来控制玩家飞船。
     */
    function gameStatePlayeLevel() {
        // 按键检测
        checkKeys();

        update();
        render();

        // 碰撞检测
        checkCollisions();

        // 奖励检测
        checkForExtraShip();

        // 关卡检测
        checkForEndOfLevel();
    }

    /**
     * 当玩家飞船与陨石、飞碟或飞碟导弹碰撞时，在玩家飞船所在位置产生一个爆炸效果。
     * 一旦爆炸完成（所有爆炸碎 片都耗尽自身的生命值），
     * 就将状态设为 GAME_STATE_PLAYER_START。
     */
    function gameStatePlayerDie() {
        if (particles.length > 0 || playerMissiles.length > 0) {
            clearBackground();

            updatePlayerMissiles();
            updateRocks();
            updateSaucers();
            updateSaucerMissiles();
            updateParticles();

            renderPlayerMissiles();
            renderRocks();
            renderSaucers();
            renderSaucerMissiles();
            renderParticles();

            renderScoreBoard();
        } else {
            playerShips -= 1;
            if (playerShips < 1) {
                switchGameState(GAME_STATE_GAME_OVER);
            } else {
                resetPlayer();
                switchGameState(GAME_STATE_PLAYER_START);
            }
        }
    }

    /**
     * 在屏幕上显示“游戏结束”，并在按下空格键时开始一个新游戏。
     */
    function gameStateGameOver() {
        if (!gameOverStarted) {
            clearBackground();
            renderScoreBoard();

            context.fillStyle = '#FF9900';
            context.font = '40px sans-serif';
            const gameName = 'Game Over!';
            context.fillText(
                gameName,
                canvasWidth / 2 - gameName.length * 10,
                150,
            );

            context.fillStyle = '#ffffff';
            context.font = '20px sans-serif';
            const gameTip = 'Press Space To Play';
            context.fillText(
                gameTip,
                canvasWidth / 2 - gameTip.length * 5,
                300,
            );
            switchGameState(GAME_STATE_INIT);
            gameOverStarted = true;
        } else if (keyPressList[32]) {
            switchGameState(GAME_STATE_TITLE);
            gameOverStarted = false;
        }
    }

    // * 功能函数 * //

    function update() {
        updatePlayer();
        updatePlayerMissiles();
        updateRocks();
        updateSaucers();
        updateSaucerMissiles();
        updateParticles();
    }

    function render() {
        clearBackground();

        renderPlayerShip();
        renderPlayerMissiles();
        renderRocks();
        renderSaucers();
        renderSaucerMissiles();
        renderParticles();

        renderScoreBoard();
    }

    function updatePlayer() {
        player.update(global);
    }

    function updatePlayerMissiles() {
        playerMissiles = playerMissiles.filter((missile) =>
            missile.update(global),
        );
    }

    function updateRocks() {
        rocks.forEach((rock) => {
            rock.update(global);
        });
    }

    function updateSaucers() {
        if (
            saucers.length < global.levelSaucerMax &&
            Math.floor(Math.random() * 100) <= global.levelSaucerOccurrenceRate
        ) {
            const saucer = new Saucer(
                new DrawImage(enemyshipImg, 64, 64),
                global,
            );
            saucers.push(saucer);
        }

        saucers = saucers.filter((saucer) => {
            if (
                Math.floor(Math.random() * 100) <= saucer.fireRate &&
                saucer.fireDelayCount > saucer.fireDelay
            ) {
                fireSaucerMissile(saucer);
                soundLoad.playSound('enemyLaser');
                saucer.fireDelayCount = 0;
            }

            return saucer.update(global);
        });
    }

    function updateSaucerMissiles() {
        saucerMissiles = saucerMissiles.filter((missile) =>
            missile.update(global),
        );
    }

    function updateParticles() {
        particles = particles.filter((particle) => particle.update(global));
    }

    /**
     * 清除画布
     */
    function clearBackground() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    /**
     * 渲染得分与剩余生命值
     */
    function renderScoreBoard() {
        context.fillStyle = '#ffffff';
        context.fillText(`得分 ${score}`, 50, 20);
        context.fillText(`第 ${level} 关`, canvasWidth / 2 - 35, 20);
        context.fillText(`生命值 X ${playerShips}`, canvasWidth - 150, 20);
    }

    function renderPlayerShip() {
        player.render(context);
    }

    function renderPlayerMissiles() {
        playerMissiles.forEach((missile) => missile.render(context));
    }

    function renderRocks() {
        rocks.forEach((rock) => {
            rock.render(context);
        });
    }

    function renderSaucers() {
        saucers.forEach((saucer) => {
            saucer.render(context);
        });
    }

    function renderSaucerMissiles() {
        saucerMissiles.forEach((missile) => missile.render(context));
    }

    function renderParticles() {
        particles.forEach((particle) => particle.render(context));
    }

    /**
     * 玩家死亡或进入新的关卡时，重置玩家状态
     */
    function resetPlayer() {
        player.rotation = 270;
        player.x = 0.5 * global.xMax;
        player.y = 0.5 * global.yMax;
        player.movingX = 0;
        player.movingY = 0;
        player.alpha = 0;
        player.thrust = false;
        player.missileFrameCount = player.missileFrameDelay;
    }

    /**
     * 检测当前键盘按键状态
     */
    function checkKeys() {
        if (keyPressList[38]) {
            // 向上键被按下
            const angleInRadians = d2a(player.rotation);
            const facingX = Math.cos(angleInRadians);
            const facingY = Math.sin(angleInRadians);
            const movingXNew =
                player.movingX + player.thrustAcceleration * facingX;
            const movingYNew =
                player.movingY + player.thrustAcceleration * facingY;
            const currentVelocity = Math.sqrt(
                movingXNew * movingXNew + movingXNew * movingXNew,
            );
            if (currentVelocity < player.maxVelocity) {
                player.movingX = movingXNew;
                player.movingY = movingYNew;
            }
            player.thrust = true;
        } else {
            // 向上键被松开
            player.thrust = false;
        }

        // 左方向键，逆时针旋转
        if (keyPressList[37]) {
            player.rotation -= player.rotationalVelocity;
            if (player.rotation < 0) {
                player.rotation += 360;
            }
        }

        // 右方向键，顺时针旋转
        if (keyPressList[39]) {
            player.rotation += player.rotationalVelocity;
            if (player.rotation > 360) {
                player.rotation -= 360;
            }
        }

        // 空格键，发射导弹
        if (
            keyPressList[32] &&
            player.missileFrameCount > player.missileFrameDelay
        ) {
            firePlayerMissile();
            soundLoad.playSound('laser');
            player.missileFrameCount = 0;
        }
    }

    /**
     * 碰撞检测
     */
    function checkCollisions() {
        // 陨石与玩家导弹
        // 陨石与飞碟
        // 陨石与飞碟导弹
        // 陨石与玩家
        for (let i = 0; i < rocks.length; i++) {
            const rock = rocks[i];

            playerMissiles = playerMissiles.filter((playerMissile) => {
                if (rock.checkColl(playerMissile)) {
                    rock.hit = true;
                    soundLoad.playSound('asteroidBoom' + rnd(1, 4));
                    createExplode(
                        rock.x + rock.halfWidth,
                        rock.y + rock.halfHeight,
                        10,
                    );
                    if (rock.scale < ROCK_SMALL) {
                        splitRock(rock.scale + 1, rock.x, rock.y);
                    }
                    // 玩家子弹击中陨石得分
                    addToScore(rock.scoreValue);
                    return false;
                }
                return true;
            });

            if (!rock.hit) {
                saucers = saucers.filter((saucer) => {
                    if (rock.checkColl(saucer)) {
                        rock.hit = true;
                        soundLoad.playSound('asteroidBoom' + rnd(1, 4));
                        createExplode(
                            rock.x + rock.halfWidth,
                            rock.y + rock.halfHeight,
                            10,
                        );
                        soundLoad.playSound('asteroidBoom1');
                        createExplode(
                            saucer.x + saucer.halfWidth,
                            saucer.y + saucer.halfHeight,
                            10,
                        );
                        if (rock.scale < ROCK_SMALL) {
                            splitRock(rock.scale + 1, rock.x, rock.y);
                        }
                        return false;
                    }
                    return true;
                });
            }

            if (!rock.hit) {
                saucerMissiles = saucerMissiles.filter((saucerMissile) => {
                    if (rock.checkColl(saucerMissile)) {
                        rock.hit = true;
                        soundLoad.playSound('asteroidBoom' + rnd(1, 4));
                        createExplode(
                            rock.x + rock.halfWidth,
                            rock.y + rock.halfHeight,
                            10,
                        );
                        if (rock.scale < ROCK_SMALL) {
                            splitRock(rock.scale + 1, rock.x, rock.y);
                        }
                        return false;
                    }
                    return true;
                });
            }

            if (!rock.hit && rock.checkColl(player)) {
                rock.hit = true;
                soundLoad.playSound('asteroidBoom' + rnd(1, 4));
                createExplode(
                    rock.x + rock.halfWidth,
                    rock.y + rock.halfHeight,
                    10,
                );
                if (rock.scale < ROCK_SMALL) {
                    splitRock(rock.scale + 1, rock.x, rock.y);
                }
                // 玩家本体击中陨石得分
                addToScore(rock.scoreValue);
                soundLoad.playSound('bigboom');
                playerDie();
            }
        }
        rocks = rocks.filter((rock) => !rock.hit);

        // 飞碟与玩家导弹
        // 飞碟与玩家
        for (let i = 0; i < saucers.length; i++) {
            const saucer = saucers[i];
            playerMissiles = playerMissiles.filter((playerMissile) => {
                if (saucer.checkColl(playerMissile)) {
                    saucer.hit = true;
                    soundLoad.playSound('asteroidBoom1');
                    createExplode(
                        saucer.x + saucer.halfWidth,
                        saucer.y + saucer.halfHeight,
                        10,
                    );
                    // 玩家子弹击中飞碟得分
                    addToScore(saucer.scoreValue);
                    return false;
                }
                return true;
            });

            if (!saucer.hit && saucer.checkColl(player)) {
                saucer.hit = true;
                soundLoad.playSound('asteroidBoom1');
                createExplode(
                    saucer.x + saucer.halfWidth,
                    saucer.y + saucer.halfHeight,
                    10,
                );
                // 玩家本地击中飞碟得分
                addToScore(saucer.scoreValue);
                soundLoad.playSound('bigboom');
                playerDie();
            }
        }
        saucers = saucers.filter((saucer) => !saucer.hit);

        // 飞碟导弹与玩家
        for (let i = 0; i < saucerMissiles.length; i++) {
            const saucerMissile = saucerMissiles[i];
            if (saucerMissile.checkColl(player)) {
                saucerMissile.hit = true;
                soundLoad.playSound('bigboom');
                playerDie();
                break;
            }
        }
        saucerMissiles = saucerMissiles.filter(
            (saucerMissile) => !saucerMissile.hit,
        );
    }

    /**
     * 检测关卡是否结束，是则进入下一关卡
     */
    function checkForEndOfLevel() {
        if (rocks.length === 0) {
            switchGameState(GAME_STATE_NEW_LEVEL);
        }
    }

    /**
     * 奖励玩家另外的飞船
     */
    function checkForExtraShip() {
        if (Math.floor(score / extraShipAtEach) > extraShipsEarned) {
            playerShips += 1;
            extraShipsEarned += 1;
        }
    }

    /**
     * 发射玩家导弹
     */
    function firePlayerMissile() {
        const missile = new Missile(
            new DrawImage(prerenderer.images.bullet, 18, 22),
        );
        missile.rotation = player.rotation;
        missile.x = player.x + player.halfWidth;
        missile.y = player.y + player.halfHeight;
        missile.dx = player.missileSpeed * Math.cos(d2a(player.rotation));
        missile.dy = player.missileSpeed * Math.sin(d2a(player.rotation));
        missile.life = 90;
        missile.lifeCtr = 0;
        playerMissiles.push(missile);
    }

    /**
     *  发射飞碟导弹
     */
    function fireSaucerMissile(saucer) {
        const missile = new Missile(
            new DrawImage(prerenderer.images.enemybullet, 24, 24),
        );
        missile.x = saucer.x + saucer.halfWidth;
        missile.y = saucer.y + saucer.halfHeight;
        const diffx = player.x - saucer.x;
        const diffy = player.y - saucer.y;
        const radians = Math.atan2(diffy, diffx);
        missile.dx = saucer.missileSpeed * Math.cos(radians);
        missile.dy = saucer.missileSpeed * Math.sin(radians);
        missile.life = 240;
        missile.lifeCtr = 0;
        saucerMissiles.push(missile);
    }

    /**
     * 玩家死亡
     */
    function playerDie() {
        createExplode(
            player.x + player.halfWidth,
            player.y + player.halfWidth,
            50,
        );
        switchGameState(GAME_STATE_PLAYER_DIE);
    }

    /**
     * 创建碎片
     * @param x 碎片起点x坐标
     * @param y 碎片起点y坐标
     * @param num 创建碎片数量
     */
    function createExplode(x, y, num) {
        for (let i = 0; i < num; i++) {
            const particle = new Particle();
            particle.x = x;
            particle.y = y;
            particles.push(particle);
        }
    }

    /**
     * 分裂成小陨石
     */
    function splitRock(scale, x, y) {
        for (let i = 0; i < 2; i++) {
            let rock: Rock;
            if (scale === ROCK_MEDIUM) {
                rock = new Rock(new DrawImage(asteroidImgs[0], 64, 64), global);
            } else if (scale === ROCK_SMALL) {
                rock = new Rock(new DrawImage(asteroidImgs[0], 64, 64), global);
            }
            rock.setScale(scale);
            rock.x = x;
            rock.y = y;
            rocks.push(rock);
        }
    }

    /**
     * 计算玩家最新得分
     * @param value 得分
     */
    function addToScore(value) {
        score += value;
    }

    /**
     * 执行状态机
     */
    function runGame() {
        renderBackground();

        currentGameStateFunction();
    }

    /**
     * 渲染背景
     */
    function renderBackground() {
        if (background) {
            background.update();
            background.render(contextBg);
        }
    }

    /**
     * 循环帧动画
     */
    function gameLoop() {
        runGame();
        requestAnimationFrame(gameLoop);
    }

    /**
     * 键盘按下
     */
    document.addEventListener('keydown', function (e) {
        keyPressList[e.keyCode] = true;
    });

    /**
     * 键盘松开
     */
    document.addEventListener('keyup', function (e) {
        keyPressList[e.keyCode] = false;
    });

    backgroundImg.src = './images/bg.jpg';
    backgroundImg.onload = function () {
        background = new Background(
            new DrawImage(backgroundImg, canvasWidth, canvasHeight),
        );
        switchGameState(GAME_STATE_TITLE);
        requestAnimationFrame(gameLoop);
    };
}

window.addEventListener('load', function () {
    canvasApp();
});
