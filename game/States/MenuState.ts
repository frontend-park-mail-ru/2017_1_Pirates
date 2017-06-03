import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import {RealmState} from "../Realm/RealmState";
import {IObject} from "../ObjectFactory/ObjectFactory";
import {Building} from "../Map/Building";
import {Random} from "../Utils/Random";


declare const Realm: RealmClass;


export class MenuState extends RealmState {


    private closerBuilding: Building;
    private buildings: Building[] = [];


    constructor(name: string, scene: BABYLON.Scene) {
        super(name, scene);

        Realm['_generateBuildingForMenu'] = true;
        this.closerBuilding = new Building(2001, 'closer', scene, this);
        this.closerBuilding.setEnabled(false);
        Realm['_generateBuildingForMenu'] = false;

        this.closerBuilding.position = new BABYLON.Vector3(-100, -100, -50);
        this.closerBuilding.rotation.x = -0.1;
        const random: Random = new Random(1996);

        for (let i = 0; i < 7; i++) {
            const building: Building = new Building(i, 'menu', scene, this);
            building.setEnabled(false);
            building.position = new BABYLON.Vector3(-800 + random.range(-70, 70), -600, -60 + 100 * i);
            building.rotation.y = random.range(0, Math.PI, false);

            this.buildings.push(building);
        }

        this.alpha = ((<any> Realm).states.size - 1) * 0.5 * Math.PI;
        this.repositionOnAlpha();

        console.log('Menu created!');
    }


    public onEnter() {
        Realm.toggleLoading(false);
        this.closerBuilding.setEnabled(true);

        this.buildings.forEach((building: Building) => {
            building.setEnabled(true);
            building['_trueYPos'] = building.position.y;
        });
    }


    public onRender() {
        this.buildings.forEach((building: Building, i: number) => {
            building.position.y = building['_trueYPos'] + 10 * Math.sin(i + RealmClass.now() * 0.001);
        });
    }


    public onLeave() {
        this.closerBuilding.setEnabled(false);

        this.buildings.forEach((building: Building) => {
            building.setEnabled(false);
        });
    }

}