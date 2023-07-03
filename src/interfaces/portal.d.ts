import { IPortalDestination } from './portal-destination'

export interface IPortalConstructor {
    scene: Phaser.Scene
    spawn: IPortalDestination
    x: number
    y: number
    width?: number
    height?: number
}
