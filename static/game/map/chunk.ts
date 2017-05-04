import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";

declare const BABYLON;
declare const JSWorks;

export class Chunk extends (<INewable> BABYLON.Mesh) {

    private scene: MotionScene;
    public ground: any;

    public isActive: boolean = false;

    private height: number = 1000;
    private width: number = 1000;

    constructor(name: string, scene: MotionScene, widht, height) {
        super(name, scene);
        this.scene = scene;
        this.width = widht;
        this.height = height;
        this.ground = BABYLON.Mesh.CreateGround('ground', this.width, this.height, 25, this.scene);
        this.ground.position.z = -2000;
        this.ground.material = new BABYLON.StandardMaterial('ground', this.scene);

        /*
        if (this.name === "red") {
            this.ground.material.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        }
        if (this.name === "green") {
            this.ground.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
        }
        if (this.name === "blue") {
            this.ground.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 1.0);
        }
        */

		// this.ground.material.diffuseColor = new BABYLON.Color3(62 / 255, 73 / 255, 137 / 255);

		this.ground.material.emissiveColor = new BABYLON.Color3(107 / 255, 118 / 255, 186 / 255);
        this.ground.material.wireframe = true;
    }

    public getScene(): MotionScene {
        return this.scene;
    }

    public init(position: { x: number, z: number }) {
        this.ground.position.x = position.x;
        this.ground.position.z = position.z;
        this.ground.position.y = -10;
        this.isActive = true;
    }

    public getSize(): { h: number, w: number } {
        return {h: this.height, w: this.width};
    }

    public getBorder(): { leftDown: { x: number, z: number }, rightTop: { x: number, z: number } } {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        return {
            leftDown: {x: this.ground.position.x - halfWidth, z: this.ground.position.z - halfHeight},
            rightTop: {x: this.ground.position.x + halfWidth, z: this.ground.position.z + halfHeight}
        };
    }

    public inArea(pos: any): boolean {
        const border = this.getBorder();
        return (border.leftDown.x <= pos.x) && (pos.x <= border.rightTop.x) && (pos.z >= border.leftDown.z)
            && (pos.z <= border.rightTop.z);
    }

    /**
     * метод проверки входит ли блок в зону видимости
     * @param area
     * @returns {boolean}
     */
    public isSeeable(area: any): boolean {
        const border = this.getBorder();
        return (border.rightTop.z >= area.leftDown.z) && (area.rightTop.x >= border.rightTop.x) && (area.leftDown.x <= border.leftDown.x)
        // (border.rightTop.x <= area.rightTop.x);
    }

}
