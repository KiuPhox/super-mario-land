import { BootScene } from './scenes/boot-scene'
import { GameScene } from './scenes/game-scene'
import { HUDScene } from './scenes/hud-scene'
import { MenuScene } from './scenes/menu-scene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Super Mario Land',
    zoom: 5,
    type: Phaser.WEBGL,
    scale: {
        width:
            window.innerWidth > window.innerHeight
                ? (144 * window.innerWidth) / window.innerHeight
                : 160,
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
    backgroundColor: '#f8f8f8',
    render: { pixelArt: true, antialias: false },
}
