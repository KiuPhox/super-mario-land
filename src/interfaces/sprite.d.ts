export interface ISpriteConstructor {
    scene: Phaser.Scene
    x: number
    y: number
    texture: string
    frame?: string | number
}
export interface IMario extends ISpriteConstructor {
    projectiles: Phaser.Physics.Arcade.Group
}
