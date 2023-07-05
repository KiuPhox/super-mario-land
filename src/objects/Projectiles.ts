import { IGroup } from '../interfaces/group'

export default class ProjectilesGroup extends Phaser.GameObjects.Group {
    constructor(g: IGroup) {
        super(g.scene, { defaultKey: 'projectile' })
    }
}
