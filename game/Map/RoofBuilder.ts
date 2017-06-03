import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import Vector2 = BABYLON.Vector2;
import Vector3 = BABYLON.Vector3;
import Matrix = BABYLON.Matrix;
import Color4 = BABYLON.Color4;
import StandardMaterial = BABYLON.StandardMaterial;
import {Builder} from "./Builder";
import {WallBuilder} from "./WallBuilder";


declare const Realm: RealmClass;


export abstract class RoofBuilder extends WallBuilder {
    public build(n: number): void {}
    public buildWall(leftBottom: Vector3, leftTop: Vector3, rightTop: Vector3, rightBottom: Vector3): void {}
    public abstract buildRoof(points: Vector3[]): void;
}


export class SquareRoofBuilder extends RoofBuilder {

    // The order is: leftBottom, leftTop, rightTop, rightBottom
    public buildRoof(points: Vector3[]): void {
        const xSize: number = points[1].subtract(points[0]).length();
        const zSize: number = points[2].subtract(points[1]).length();
        const size: number = (zSize < xSize) ? zSize : xSize;
        const height: number = this.random.range(7, 14);

        const topDelta: Vector3 = new Vector3(-0.5 * (xSize - size), height, -0.5 * (zSize - size));
        const bottomDelta: Vector3 = new Vector3(0.5 * (xSize - size), height, 0.5 * (zSize - size));
        const heightVector: Vector3 = new Vector3(0, height, 0);

        const leftBottom: Vector3 = points[0].add(bottomDelta);
        const leftTop: Vector3 = points[1].add(topDelta);
        const rightTop: Vector3 = points[2].add(topDelta);
        const rightBottom: Vector3 = points[3].add(bottomDelta);


        this.buildTriangle(points[0], leftBottom, leftBottom.subtract(heightVector), this.wallDarkColor);
        this.buildSurface(leftBottom.subtract(heightVector), leftBottom, leftTop,
                leftTop.subtract(heightVector), this.wallDarkColor);
        this.buildTriangle(leftTop.subtract(heightVector), leftTop, points[1], this.wallDarkColor);


        this.buildTriangle(rightBottom.subtract(heightVector), rightBottom, points[3], this.wallDarkColor);
        this.buildSurface(rightTop.subtract(heightVector), rightTop, rightBottom,
                rightBottom.subtract(heightVector), this.wallDarkColor);
        this.buildTriangle(points[2], rightTop, rightTop.subtract(heightVector), this.wallDarkColor);


        this.buildSurface(points[3], rightBottom, leftBottom, points[0], this.wallDarkColor);
        this.buildSurface(points[1], leftTop, rightTop, points[2], this.wallDarkColor);
        this.buildSurface(rightBottom, rightTop, leftTop, leftBottom, this.wallDarkColor);


        this.args['roof'] = {leftBottom, leftTop, rightTop, rightBottom};
        this.args['height'] = leftBottom.y;
        this.args['nextPosition'] = BABYLON.Vector3.Center(leftBottom, rightTop);

        this.args['xParam'] = size * 0.5;
        this.args['zParam'] = size * 0.5;
    }

}
