export default class HUDScene extends Phaser.Scene {
    private textElements: Map<string, Phaser.GameObjects.BitmapText>
    private timer: Phaser.Time.TimerEvent

    constructor() {
        super({
            key: 'HUDScene',
        })
    }

    create(): void {
        const { width } = this.scale
        this.textElements = new Map([
            ['LIVES', this.addText(0, 0, `MARIOx ${this.registry.get('lives')}`)],
            [
                'WORLDTIME',
                this.addText(width, 0, `${this.registry.get('worldTime')}`).setOrigin(1, 0),
            ],
            ['SCORE', this.addText(0, 8, `${this.registry.get('score')}`)],
            ['COINS', this.addText(width * 0.4, 8, `${this.registry.get('coins')}`)],
            ['WORLD', this.addText(width * 0.6, 8, `${this.registry.get('world')}`)],
            ['TIME', this.addText(width, 8, `${this.registry.get('time')}`).setOrigin(1, 0)],
        ])

        // create events
        const level = this.scene.get('GameScene')
        level.events.on('coinsChanged', this.updateCoins, this)
        level.events.on('scoreChanged', this.updateScore, this)
        level.events.on('livesChanged', this.updateLives, this)

        // add timer
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTime,
            callbackScope: this,
            loop: true,
        })
    }

    private addText(x: number, y: number, value: string): Phaser.GameObjects.BitmapText {
        return this.add.bitmapText(x, y, 'font', value, 8)
    }

    private updateTime() {
        this.registry.values.time -= 1
        this.textElements.get('TIME')?.setText(`${this.registry.get('time')}`)
    }

    private updateCoins() {
        (this.textElements.get('COINS') as Phaser.GameObjects.BitmapText)
            .setText(`${this.registry.get('coins')}`)
            .setX(80 - 8 * (this.registry.get('coins').toString().length - 1))
    }

    private updateScore() {
        (this.textElements.get('SCORE') as Phaser.GameObjects.BitmapText)
            .setText(`${this.registry.get('score')}`)
            .setX(40 - 8 * (this.registry.get('score').toString().length - 1))
    }

    private updateLives() {
        (this.textElements.get('LIVES') as Phaser.GameObjects.BitmapText).setText(
            `Lives: ${this.registry.get('lives')}`
        )
    }
}
