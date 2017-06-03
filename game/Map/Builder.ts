import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import Vector2 = BABYLON.Vector2;
import Vector3 = BABYLON.Vector3;
import Matrix = BABYLON.Matrix;
import Color4 = BABYLON.Color4;
import StandardMaterial = BABYLON.StandardMaterial;
import {Random} from "../Utils/Random";


declare const Realm: RealmClass;


export abstract class Builder {

    public random: Random;
    public darks: BABYLON.VertexData;
    public lights: BABYLON.VertexData;
    public args: object;


    public get positions(): number[] {
        return <number[]> this.darks.positions;
    }

    public get normals(): number[] {
        return <number[]> this.darks.normals;
    }

    public get colors(): number[] {
        return <number[]> this.darks.colors;
    }

    public get indices(): number[] {
        return <number[]> this.darks.indices;
    }


    constructor(random: Random, darks: BABYLON.VertexData, lights: BABYLON.VertexData,
                args: object = {}) {
        this.darks = darks;
        this.lights = lights;
        this.random = random;
        this.args = args;
    }

    public abstract build(index: number): void;

    public concatVector(arr: number[], v: Vector3): void {
        arr.push(v.x, v.y, v.z);
    }

    public concatPositions(v: Vector3, lights: boolean = false): void {
        this.concatVector(lights ? <number[]> this.lights.positions : this.positions, v);
    }

    public concatNormals(v: Vector3, lights: boolean = false): void {
        this.concatVector(lights ? <number[]> this.lights.normals : this.normals, v);
    }

    public concatIndices(arr: number[], offset: number, lights: boolean = false): void {
        if (lights) {
            this.lights.indices['_offset'] = this.lights.indices['_offset'] || 0;
            arr.map(index => this.lights.indices['_offset'] + index).forEach(
                index => ((<number[]> this.lights.indices).push(index)));
            this.lights.indices['_offset'] += offset;

            return;
        }

        this.indices['_offset'] = this.indices['_offset'] || 0;
        arr.map(index => this.indices['_offset'] + index).forEach(index => this.indices.push(index));
        this.indices['_offset'] += offset;
    }

    public concatColor(color: BABYLON.Color4, lights: boolean = false): void {
        if (lights) {
            (<number[]> this.lights.colors).push(color.r, color.g, color.b, color.a);

            return;
        }

        this.colors.push(color.r, color.g, color.b, color.a);
    }

}
