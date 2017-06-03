import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import {IObject} from "../ObjectFactory/ObjectFactory";
import Vector2 = BABYLON.Vector2;
import Vector3 = BABYLON.Vector3;
import Matrix = BABYLON.Matrix;
import Color4 = BABYLON.Color4;
import StandardMaterial = BABYLON.StandardMaterial;
import {
    BuildingShapeBuilder, RectangularBuildingShapeBuilder,
    SquareBuildingShapeBuilder, HexagonBuildingShapeBuilder, Complex1BuildingShapeBuilder
} from "./BuildingShapeBuilder";
import {Random} from "../Utils/Random";


declare const Realm: RealmClass;


export class BuildingSectionScaffold extends BABYLON.Mesh {

    public darks: BABYLON.VertexData = Building.VertexData();
    public lights: BABYLON.VertexData = Building.VertexData();

    public floors: number;
    public isSmall: boolean = true;
    public shape: BuildingShapeBuilder;

    public darksMesh: BABYLON.Mesh;
    public lightsMesh: BABYLON.Mesh;
    public height: number;

    public random: Random;


    constructor(random: Random, name: string, scene: BABYLON.Scene, parent: BABYLON.Mesh,
                isSmall: boolean, args: object, isTop: boolean) {
        super(name, scene, parent);

        if (random === undefined) {
            return;
        }

        this.random = random;
        this.isSmall = isSmall;

        this.floors = this.random.range(80, 100);

        if (isTop) {
            this.floors = this.random.range(20, 50);
        }

        args['floors'] = this.floors;

        let shapes: any[] = [RectangularBuildingShapeBuilder, SquareBuildingShapeBuilder];

        if (!this.isSmall) {
            shapes.concat([HexagonBuildingShapeBuilder, Complex1BuildingShapeBuilder]);

            args['minXParam'] = 25;
            args['minZParam'] = args['minXParam'];

            args['maxXParam'] = 40;
            args['maxZParam'] = args['maxXParam'];
        }

        this.shape = new (this.random.choose(shapes))
                (this.random, this.darks, this.lights, args);

        for (let i = 0; i < this.floors; i++) {
            this.buildFloor(i);
        }

        this.buildRoof();
        this.height = args['height'];


        this.darksMesh = new BABYLON.Mesh('darks', scene);
        this.darksMesh.material = new BABYLON.StandardMaterial('darks', scene);
        this.darksMesh.parent = this;
        this.darks.applyToMesh(this.darksMesh, false);

        (<StandardMaterial> this.darksMesh.material).emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4);


        this.lightsMesh = new BABYLON.Mesh('lights', scene);
        this.lightsMesh.material = new BABYLON.StandardMaterial('lights', scene);
        this.lightsMesh.parent = this;
        this.lights.applyToMesh(this.lightsMesh, false);

        (<StandardMaterial> this.lightsMesh.material).emissiveColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    }


    public clone(): BuildingSectionScaffold {
        const section: BuildingSectionScaffold = new (<any> BuildingSectionScaffold)();

        section.darksMesh = this.darksMesh.clone('lights');
        section.lightsMesh = this.lightsMesh.clone('lights');
        section.height = this.height;
        section.floors = this.floors;

        return section;
    }



    private buildFloor(index: number): void {
        this.shape.build(index)
    }


    private buildRoof(): void {
        this.shape.buildRoof();
    }

}


export class Building extends BABYLON.Mesh implements IObject {

    public mesh: BABYLON.Mesh;
    public random: Random;

    public lowerScaffold: BuildingSectionScaffold;
    public upperScaffold: BuildingSectionScaffold;
    public isSmall: boolean;
    public args: object = {};
    public height: number = 0;


    constructor(seed: number, name: string, scene: BABYLON.Scene, parent: BABYLON.Mesh) {
        super(name, scene, parent);

        if (seed === undefined) {
            return;
        }

        this.random = new Random(seed);
        this.isSmall = this.random.boolean;

        if (this.isSmall) {
            this.lowerScaffold = new BuildingSectionScaffold(this.random, 'lowerScaffold', scene, this,
                    true, this.args, false);
            this.height = this.lowerScaffold.height;
        } else {
            this.lowerScaffold = new BuildingSectionScaffold(this.random, 'lowerScaffold', scene, this,
                    false, this.args, false);

            const upperPos: Vector3 = this.args['nextPosition'];
            this.upperScaffold = new BuildingSectionScaffold(this.random, 'upperScaffold', scene, this,
                    true, this.args, true);
            this.upperScaffold.position = upperPos;
            this.height = this.lowerScaffold.height + this.upperScaffold.height;
        }

        //this.material = new StandardMaterial('material', scene);
        //this.material.alpha = 0;
    }


    public onCreate(): void {
    }

    public onGrab(): void {
        this.setEnabled(true);
    }

    public onFree(): void {
        this.setEnabled(false);
    }

    public onRender(): void {
        /*if (this.visibility < 1) {
            this.visibility += 0.05;
        }

        if (this.visibility > 1) {
            this.visibility = 1;
        }*/
    }

    public onDelete(): void {
        this.setEnabled(false);
        this.lowerScaffold.dispose(true);

        if (this.upperScaffold) {
            this.upperScaffold.dispose(true);
        }

        this.dispose(true);
    }


    public clone(): Building {
        const building: Building = new (<any> Building)();

        building.lowerScaffold = this.lowerScaffold.clone();
        building.upperScaffold = this.lowerScaffold ? this.lowerScaffold.clone() : undefined;
        building.height = this.height;
        building.isSmall = this.isSmall;
        building.args = this.args;

        return building;
    }



    public static VertexData(): BABYLON.VertexData {
        const result: BABYLON.VertexData = new BABYLON.VertexData();

        result.positions = [];
        result.indices = [];
        result.normals = [];
        result.colors = [];

        return result;
    }

}






