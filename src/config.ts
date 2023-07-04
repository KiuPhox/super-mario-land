import { BootScene } from './scenes/boot-scene'
import { GameScene } from './scenes/game-scene'
import { HUDScene } from './scenes/hud-scene'
import { MenuScene } from './scenes/menu-scene'
import AnimatedTiles from './plugins/AnimatedTiles'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Super Mario Land',
    zoom: 5,
    type: Phaser.WEBGL,
    scale: {
        width: 160,
        height: 144,
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, HUDScene, GameScene],
    input: {
        keyboard: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: { y: 475 },
        },
    },
    plugins: {
        scene: [
            {
                key: 'animatedTiles',
                plugin: AnimatedTiles,
                mapping: 'animatedTiles',
            },
        ],
    },
    backgroundColor: '#e2f3e4',
    render: { pixelArt: true, antialias: false },
}
