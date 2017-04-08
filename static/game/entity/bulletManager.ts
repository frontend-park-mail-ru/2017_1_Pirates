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


    public fire(position, direction, speed, jedi: boolean = false, distance = 500) {
    	if (this.bullets.length > 160) {
    		return;
		}

        this.lastBulletId++;
        const bullet = new BABYLON.Mesh.CreateBox(`bullet_${this.lastBulletId}`, 0.1, (<any> this).getScene());

        bullet.__position = position.clone();
        bullet.__direction = direction.normalize().scale(speed);
        bullet.__speed = speed;
        bullet.__distance = distance;
        bullet.__flew = 0;

        bullet.position = bullet.__position.add(direction.scale(speed * 2));
        bullet.scaling = new BABYLON.Vector3(1.0, 1.0, 100.0);
		bullet.lookAt(bullet.position.add(bullet.__direction));

        bullet.material = new BABYLON.StandardMaterial('bullet_mat', (<any> this).getScene());
		bullet.material.alpha = 0.7;

        bullet.__light = new BABYLON.SpotLight(
        	'l',
			new BABYLON.Vector3(0, 0, -0.5),
			new BABYLON.Vector3(0, 0, 0.5),
			0.05,
			2,
			(<any> this).getScene(),
		);

        if (!jedi) {
			bullet.__light.diffuse = new BABYLON.Color3(1, 0, 0);
			bullet.__light.specular = new BABYLON.Color3(0.5, 0, 0);
			bullet.material.emissiveColor = new BABYLON.Color3(1.0, 0.0, 0.0);
		} else {
			bullet.__light.diffuse = new BABYLON.Color3(0, 1, 0);
			bullet.__light.specular = new BABYLON.Color3(0, 0.5, 0);
			bullet.material.emissiveColor = new BABYLON.Color3(0.0, 1.0, 0.0);
		}

        bullet.__light.parent = bullet;

        this.bullets.push(bullet);
    }


    public updateBullets(event, emitter) {
    	const forDeleting: number[] = [];
    	let spliced: number = 0;

        this.bullets.forEach((bullet, index) => {
			bullet.position = bullet.position.add(bullet.__direction);
            bullet.__flew++;

            if (bullet.__flew > 35) {
				bullet.getScene().removeMesh(bullet.__light);
				bullet.__light.dispose(true);

                bullet.getScene().removeMesh(bullet);
                bullet.dispose(true);

				forDeleting.push(index);
				return;
            }

            const abs = (<any> bullet).getAbsolutePosition();

			(<any> this).getScene().entities.forEach((entity) => {
				const dist = BABYLON.Vector3.DistanceSquared(
					entity.getAbsolutePosition(),
					abs,
				);

				if (dist < 4) {
					entity.explode();
				}
			});
        });

        forDeleting.forEach((index) => {
			this.bullets.splice(index - spliced, 1);
			spliced++;
		});
    }

}
