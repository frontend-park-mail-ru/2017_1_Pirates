import BABYLON from "../../static/babylon";
import ShaderMaterial = BABYLON.ShaderMaterial;
import AbstractMesh = BABYLON.AbstractMesh;
import {RealmClass} from "../Realm/Realm";
import {StarShip} from "./StarShip";
import {IObject} from "../ObjectFactory/ObjectFactory";
import {OfflineGameState} from "../States/OfflineGameState";


declare const Realm: RealmClass;


export class Bullet {

    public static createBullet(name: string, parent: BABYLON.Mesh, jedi: boolean): IObject {

        const bullet = BABYLON.Mesh.CreateBox('bullet', 0.1, Realm.scene);

        bullet.scaling = new BABYLON.Vector3(6.0, 6.0, 300.0);
        bullet.material = new BABYLON.StandardMaterial('bullet_mat', Realm.scene);
        bullet.material.alpha = 0.7;

        /*bullet['_light'] = new BABYLON.SpotLight(
            'l',
            new BABYLON.Vector3(0, 0, -0.5),
            new BABYLON.Vector3(0, 0, 0.5),
            0.05,
            2,
            Realm.scene,
        );*/

        if (!jedi) {
            //bullet['_light'].diffuse = new BABYLON.Color3(1, 0, 0);
            //bullet['_light'].specular = new BABYLON.Color3(0.5, 0, 0);
            (<any> bullet.material).emissiveColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        } else {
            //bullet['_light'].diffuse = new BABYLON.Color3(0, 1, 0);
            //bullet['_light'].specular = new BABYLON.Color3(0, 0.5, 0);
            (<any> bullet.material).emissiveColor = new BABYLON.Color3(0.0, 1.0, 0.0);
        }

        //bullet['_light'].parent = bullet;

        bullet['onCreate'] = () => {};
        bullet['onGrab'] = () => { bullet.setEnabled(true); };
        bullet['onFree'] = () => { bullet.setEnabled(false); };
        bullet['onDelete'] = () => {};

        bullet['onRender'] = () => {
            bullet.position.addInPlace(bullet['_direction']);
            bullet['_flew']++;

            (<OfflineGameState> Realm.state).ships.forEach((ship: StarShip) => {
                if (ship === bullet['_ship']) {
                    return;
                }

                if (ship.intersectsMesh(bullet)) {
                    console.log('intersects!');
                    ship.health -= 50;
                }
            });

            if (bullet['_flew'] > 20) {
                Realm.objects.free(name, <any> bullet);
            }
        };

        bullet['fire'] = (ship: StarShip, position: BABYLON.Vector3, direction: BABYLON.Vector3) => {
            const speed = 15;

            bullet.position = position.clone();

            if (!jedi) {
                bullet.position.x += 5;
            }

            bullet['_direction'] = direction.normalize().scale(speed);
            bullet.lookAt(bullet.position.add(bullet['_direction']));
            bullet['_flew'] = 0;
            bullet['_ship'] = ship;
        };

        return <any> bullet;
    }

}
