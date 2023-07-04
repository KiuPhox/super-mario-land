import { Box } from '../objects/box'
import { Brick } from '../objects/brick'
import { Collectible } from '../objects/collectible'
import { Goomba } from '../objects/goomba'
import { Mario } from '../objects/mario'
import { Platform } from '../objects/platform'
import { Portal } from '../objects/portal'
import AnimatedTiles from '../plugins/AnimatedTiles'

export class GameScene extends Phaser.Scene {
    // tilemap
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset
    private backgroundLayer: Phaser.Tilemaps.TilemapLayer
    private foregroundLayer: Phaser.Tilemaps.TilemapLayer

    // game objects
    private boxes: Phaser.GameObjects.Group
    private bricks: Phaser.GameObjects.Group
    private collectibles: Phaser.GameObjects.Group
    private enemies: Phaser.GameObjects.Group
    private platforms: Phaser.GameObjects.Group
    private player: Mario
    private portals: Phaser.GameObjects.Group

    private animatedTiles: AnimatedTiles

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        //
    }

    create(): void {
        // *****************************************************************
        // SETUP TILEMAP
        // *****************************************************************

        // create our tilemap from Tiled JSON
        this.map = this.make.tilemap({ key: this.registry.get('level') })
        // add our tileset and layers to our tilemap

        this.tileset = this.map.addTilesetImage('tiles') as Phaser.Tilemaps.Tileset
        this.animatedTiles.init(this.map)

        this.backgroundLayer = this.map.createLayer(
            'backgroundLayer',
            this.tileset,
            0,
            0
        ) as Phaser.Tilemaps.TilemapLayer

        this.foregroundLayer = this.map.createLayer(
            'foregroundLayer',
            this.tileset,
            0,
            0
        ) as Phaser.Tilemaps.TilemapLayer
        this.foregroundLayer.setName('foregroundLayer')

        // set collision for tiles with the property collide set to true
        this.foregroundLayer.setCollisionByProperty({ collide: true })

        // *****************************************************************
        // GAME OBJECTS
        // *****************************************************************
        this.portals = this.add.group({
            /*classType: Portal,*/
            runChildUpdate: true,
        })

        this.boxes = this.add.group({
            /*classType: Box,*/
            runChildUpdate: true,
        })

        this.bricks = this.add.group({
            /*classType: Brick,*/
            runChildUpdate: true,
        })

        this.collectibles = this.add.group({
            /*classType: Collectible,*/
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            runChildUpdate: true,
        })

        this.platforms = this.add.group({
            /*classType: Platform,*/
            runChildUpdate: true,
        })

        this.loadObjectsFromTilemap()

        // *****************************************************************
        // COLLIDERS
        // *****************************************************************
        this.physics.add.collider(this.player, this.foregroundLayer)
        this.physics.add.collider(this.enemies, this.foregroundLayer)
        this.physics.add.collider(this.enemies, this.boxes)
        this.physics.add.collider(this.enemies, this.bricks)
        this.physics.add.collider(this.player, this.bricks)

        this.physics.add.collider(this.player, this.boxes, this.playerHitBox)

        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyOverlap)

        this.physics.add.overlap(this.player, this.portals, this.handlePlayerPortalOverlap)

        this.physics.add.collider(this.player, this.platforms, this.handlePlayerOnPlatform)

        this.physics.add.overlap(
            this.player,
            this.collectibles,
            this.handlePlayerCollectiblesOverlap
        )

        // *****************************************************************
        // CAMERA
        // *****************************************************************
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    }

    update(): void {
        this.player.update()
    }

    private loadObjectsFromTilemap() {
        // get the object layer in the tilemap named 'objects'
        const objects = this.map.getObjectLayer('objects')?.objects as any[]

        objects.forEach((object) => {
            if (object.type === 'portal') {
                this.portals.add(
                    new Portal({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        height: object.width,
                        width: object.height,
                        spawn: {
                            x: object.properties[1].value,
                            y: object.properties[2].value,
                            dir: object.properties[0].value,
                        },
                    }).setName(object.name)
                )
            } else if (object.type === 'player') {
                this.player = new Mario({
                    scene: this,
                    x: this.registry.get('spawn').x,
                    y: this.registry.get('spawn').y,
                    texture: 'mario',
                })
            } else if (object.type === 'goomba') {
                this.enemies.add(
                    new Goomba({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'goomba',
                    })
                )
            } else if (object.type === 'brick') {
                this.bricks.add(
                    new Brick({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'brick',
                        value: 50,
                    })
                )
            } else if (object.type === 'box') {
                this.boxes.add(
                    new Box({
                        scene: this,
                        content: object.properties[0].value,
                        x: object.x,
                        y: object.y,
                        texture: 'box',
                    })
                )
            } else if (object.type === 'collectible') {
                this.collectibles.add(
                    new Collectible({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: object.properties[0].value,
                        points: 100,
                    })
                )
            } else if (object.type === 'movingPlatform') {
                if (object.properties[0].value === 'up') {
                    this.platforms.add(
                        new Platform({
                            scene: this,
                            x: object.x,
                            y: object.y,
                            texture: 'platform',
                            tweenProps: {
                                y: {
                                    value: 50,
                                    duration: 1500,
                                    ease: 'Power0',
                                },
                            },
                        })
                    )
                } else if (object.properties[0].value === 'down') {
                    this.platforms.add(
                        new Platform({
                            scene: this,
                            x: object.x,
                            y: object.y,
                            texture: 'platform',
                            tweenProps: {
                                y: {
                                    value: 100,
                                    duration: 1500,
                                    ease: 'Power0',
                                },
                            },
                        })
                    )
                } else if (object.properties[0].value === 'right') {
                    this.platforms.add(
                        new Platform({
                            scene: this,
                            x: object.x,
                            y: object.y,
                            texture: 'platform',
                            tweenProps: {
                                x: {
                                    value: object.x + 50,
                                    duration: 1200,
                                    ease: 'Power0',
                                },
                            },
                        })
                    )
                } else if (object.properties[0].value === 'left') {
                    this.platforms.add(
                        new Platform({
                            scene: this,
                            x: object.x,
                            y: object.y,
                            texture: 'platform',
                            tweenProps: {
                                x: {
                                    value: object.x - 50,
                                    duration: 1200,
                                    ease: 'Power0',
                                },
                            },
                        })
                    )
                }
            }
        })
    }

    private handlePlayerEnemyOverlap = (
        object1: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody,
        object2: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        const player = object1 as Mario
        const enemy = object2 as Goomba
        if (player.body.touching.down && enemy.body.touching.up) {
            // player hit enemy on top
            player.bounceUpAfterHitEnemyOnHead()
            enemy.gotHitOnHead()
            this.add.tween({
                targets: enemy,
                props: { alpha: 0 },
                duration: 1000,
                ease: 'Power0',
                yoyo: false,
                onComplete: function () {
                    enemy.isDead()
                },
            })
        } else {
            // player got hit from the side or on the head
            if (player.getVulnerable()) {
                player.gotHit()
            }
        }
    }

    /**
     * Player <-> Box Overlap
     * @param _player [Mario]
     * @param _box  [Box]
     */

    private playerHitBox = (
        object1: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody,
        object2: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        const box: Box = object2 as Box

        if (box.body.touching.down && box.active) {
            // ok, mario has really hit a box on the downside
            box.yoyoTheBoxUpAndDown()
            this.collectibles.add(box.spawnBoxContent())

            switch (box.getBoxContentString()) {
                // have a look what is inside the box! Christmas time!
                case 'coin': {
                    box.tweenBoxContent({ y: box.y - 40, alpha: 0 }, 700, function () {
                        box.getContent().destroy()
                    })

                    box.addCoinAndScore(1, 100)
                    break
                }
                case 'rotatingCoin': {
                    box.tweenBoxContent({ y: box.y - 40, alpha: 0 }, 700, function () {
                        box.getContent().destroy()
                    })

                    box.addCoinAndScore(1, 100)
                    break
                }
                case 'flower': {
                    box.tweenBoxContent({ y: box.y - 8 }, 200, function () {
                        box.getContent().anims.play('flower')
                    })

                    break
                }
                case 'mushroom': {
                    box.popUpCollectible()
                    break
                }
                case 'star': {
                    box.popUpCollectible()
                    break
                }
                default: {
                    break
                }
            }
            box.startHitTimeline()
        }
    }

    private handlePlayerPortalOverlap = (
        object1: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody,
        object2: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        const player = object1 as Mario
        const portal = object2 as Portal

        if (
            (player.getKeys().get('DOWN')?.isDown &&
                portal.getPortalDestination().dir === 'down') ||
            (player.getKeys().get('RIGHT')?.isDown && portal.getPortalDestination().dir === 'right')
        ) {
            // set new level and new destination for mario
            this.registry.set('level', portal.name)

            this.registry.set('world', '1-' + portal.name[5])

            this.registry.set('spawn', {
                x: portal.getPortalDestination().x,
                y: portal.getPortalDestination().y,
                dir: portal.getPortalDestination().dir,
            })

            // restart the game scene
            this.scene.restart().launch('HUDScene')
        } else if (portal.name === 'exit') {
            this.scene.stop('GameScene')
            this.scene.stop('HUDScene')
            this.scene.start('MenuScene')
        }
    }

    private handlePlayerCollectiblesOverlap = (
        object1: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody,
        object2: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        const player = object1 as Mario
        const collectible = object2 as Collectible
        switch (collectible.texture.key) {
            case 'flower': {
                break
            }
            case 'mushroom': {
                player.growMario()
                break
            }
            case 'star': {
                break
            }
            default: {
                break
            }
        }
        collectible.collected()
    }

    // TODO!!!
    private handlePlayerOnPlatform = (
        object1: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody,
        object2: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        const player = object1 as Mario
        const platform = object2 as Platform
        if (platform.body.moves && platform.body.touching.up && player.body.touching.down) {
            //
        }
    }
}
