export default class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

    constructor() {
        super({
            key: 'MenuScene',
        })
    }

    init(): void {
        if (this.input.keyboard)
            this.startKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.startKey.isDown = false
        this.initGlobalDataManager()
    }

    create(): void {
        const { width, height } = this.scale
        this.add.image(width / 2, height / 2, 'title')

        this.bitmapTexts.push(
            this.add.bitmapText(width / 2, height * 0.87, 'font', 'START', 8).setOrigin(0.5, 0.5)
        )
    }

    update(): void {
        if (this.startKey.isDown) {
            this.scene.start('HUDScene')
            this.scene.start('GameScene')
            this.scene.bringToTop('HUDScene')
        }
    }

    private initGlobalDataManager(): void {
        this.registry.set('time', 400)
        this.registry.set('level', 'level1')
        this.registry.set('world', '1-1')
        this.registry.set('worldTime', 'WORLD TIME')
        this.registry.set('score', 0)
        this.registry.set('coins', 0)
        this.registry.set('lives', 2)
        this.registry.set('spawn', { x: 12, y: 44, dir: 'down' })
        this.registry.set('marioSize', 'small')
    }
}
