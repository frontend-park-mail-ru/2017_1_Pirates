import {EventType} from "../common/EventType";
declare const BABYLON;
declare const JSWorks;


export class BulletManager {

    public bullets: any[] = [];
    private scene: any;
    private lastBulletId: number = 0;


    constructor(scene) {
        this.scene = scene;

        JSWorks.EventManager.subscribe(this, scene, EventType.RENDER,
            (event, emitter) => { this.updateBullets(event, emitter); });
    }


    public getScene() {
        return this.scene;
    }


    public fire(position, direction, speed, distance) {
        this.lastBulletId++;
        const bullet = new BABYLON.Mesh.CreateBox(`bullet_${this.lastBulletId}`, 0.1, (<any> this).getScene());

        bullet.__position = position.clone();
        bullet.__direction = direction.clone();
        bullet.__speed = speed;
        bullet.__distance = distance;
        bullet.position = bullet.__position.clone();

        this.bullets.push(bullet);
    }


    public updateBullets(event, emitter) {
        this.bullets.forEach((bullet, index) => {
            bullet.position.x += bullet.__direction.x * bullet.__speed;
            bullet.position.y += bullet.__direction.y * bullet.__speed;
            bullet.position.z += bullet.__direction.z * bullet.__speed;

            if (BABYLON.Vector3.Distance(bullet.position, bullet.__position) >= bullet.__distance) {
                bullet.getScene().removeMesh(bullet);
                this.bullets.splice(index, 1);
            }
        });
    }

}
