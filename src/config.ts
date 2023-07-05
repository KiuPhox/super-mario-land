import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'
import HUDScene from './scenes/HudScene'
import MenuScene from './scenes/MenuScene'

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
            debug: true,
            gravity: { y: 475 },
        },
    },
    backgroundColor: '#e2f3e4',
    render: { pixelArt: true, antialias: false },
}
