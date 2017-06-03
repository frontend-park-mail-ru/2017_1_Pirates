import BABYLON from "../../static/babylon";
import ShaderMaterial = BABYLON.ShaderMaterial;
import AbstractMesh = BABYLON.AbstractMesh;
import {RealmClass} from "../Realm/Realm";
import {StarShip} from "./StarShip";


declare const Realm: RealmClass;


export class PoliceStarShip extends StarShip {

    public isAI: boolean = true;
    public maxSpeed: number = 0.07 * 10;


    constructor(name: string, scene: BABYLON.Scene) {
        super(name, scene, false);
    }

}