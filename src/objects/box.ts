import Collectible from './Collectible'
import { IBoxConstructor } from '../interfaces/box'

export default class Box extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    // variables
    private currentScene: Phaser.Scene
    private boxContent: string
    private content: Collectible
    private hitBoxTimeline: Phaser.Tweens.TweenManager

    public getContent(): Phaser.GameObjects.Sprite {
        return this.content
    }

    public getBoxContentString(): string {
        return this.boxContent
    }

    constructor(aParams: IBoxConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        // variables
        this.currentScene = aParams.scene
        this.boxContent = aParams.content

        this.initSprite()
        this.currentScene.add.existing(this)
    }

    private initSprite() {
        // variables
        //this.content = null
        this.hitBoxTimeline = this.currentScene.tweens

        // sprite
        this.setOrigin(0, 0)
        this.setFrame(0)

        // physics
        this.currentScene.physics.world.enable(this)
        this.body.setSize(8, 8)
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
    }

    update(): void {
        //
    }

    public yoyoTheBoxUpAndDown(): void {
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 60,
            ease: 'Power0',
            yoyo: true,
            onComplete: function () {
                this.targets[0].active = false
                this.targets[0].setFrame(1)
            },
        } as Phaser.Types.Tweens.TweenBuilderConfig)
    }

    public spawnBoxContent(): Collectible {
        this.content = new Collectible({
            scene: this.currentScene,
            x: this.x,
            y: this.y - 8,
            texture: this.boxContent,
            points: 1000,
        })
        return this.content
    }

    public tweenBoxContent(props: any, duration: number, complete: () => void): void {
        this.scene.tweens.add({
            targets: this.content,
            props: props,
            delay: 0,
            duration: duration,
            ease: 'Power0',
            onComplete: complete,
        } as Phaser.Types.Tweens.TweenBuilderConfig)
    }

    public startHitTimeline(): void {
        this.hitBoxTimeline.step()
    }

    public popUpCollectible(): void {
        this.content.body.setVelocity(30, -50)
        this.content.body.setAllowGravity(true)
        this.content.body.setGravityY(-300)
    }

    public addCoinAndScore(coin: number, score: number): void {
        this.currentScene.registry.values.coins += coin
        this.currentScene.events.emit('coinsChanged')
        this.currentScene.registry.values.score += score
        this.currentScene.events.emit('scoreChanged')
    }
}
