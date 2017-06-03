import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import Vector2 = BABYLON.Vector2;
import Vector3 = BABYLON.Vector3;
import Matrix = BABYLON.Matrix;
import Color4 = BABYLON.Color4;
import StandardMaterial = BABYLON.StandardMaterial;
import {Builder} from "./Builder";


declare const Realm: RealmClass;


export abstract class WallBuilder extends Builder {
    public readonly wallDarkColor: BABYLON.Color4 = new BABYLON.Color4(45/255, 49/255, 61/255, 1);
    public readonly wallLightColor: BABYLON.Color4 = new BABYLON.Color4(58/255, 62/255, 82/255, 1);
    public readonly windowColor: BABYLON.Color4 = new BABYLON.Color4(218/255, 191/255, 180/255, 1);
    // public readonly windowColor: BABYLON.Color4 = new BABYLON.Color4(232/255, 222/255, 212/255, 1);


    public build(index: number): void {};
    public abstract buildWall(leftBottom: Vector3, leftTop: Vector3, rightTop: Vector3,
                              rightBottom: Vector3): void;


    protected buildTriangle(leftBottom, leftTop, rightTop, color: Color4 = this.wallLightColor,
                            toLights: boolean = false) {
        const normal: Vector3 = Vector3.Cross(
            rightTop.subtract(leftTop), leftBottom.subtract(leftTop)
        ).normalize();

        const positions: number[] = toLights ? <number[]> this.lights.positions : this.positions;
        const normals: number[] = toLights ? <number[]> this.lights.normals : this.normals;

        this.concatVector(positions, leftBottom);
        this.concatVector(positions, leftTop);
        this.concatVector(positions, rightTop);

        for (let i = 0; i < 3; i++) {
            this.concatVector(normals, normal);
            this.concatColor(color, toLights);
        }

        this.concatIndices([2, 1, 0], 3, toLights);
    }


    protected buildSurface(leftBottom: Vector3, leftTop: Vector3, rightTop: Vector3,
                           rightBottom: Vector3, color: Color4 = this.wallLightColor,
                           toLights: boolean = false): void {
        const normal: Vector3 = Vector3.Cross(
            rightTop.subtract(leftTop), leftBottom.subtract(leftTop)
        ).normalize();

        const positions: number[] = toLights ? <number[]> this.lights.positions : this.positions;
        const normals: number[] = toLights ? <number[]> this.lights.normals : this.normals;

        this.concatVector(positions, leftBottom);
        this.concatVector(positions, leftTop);
        this.concatVector(positions, rightTop);
        this.concatVector(positions, rightBottom);

        for (let i = 0; i < 4; i++) {
            this.concatVector(normals, normal);
            this.concatColor(color, toLights);
        }

        this.concatIndices([2, 1, 0, 0, 3, 2], 4, toLights);
    }
}


export class BlankBuilder extends WallBuilder {
    public buildWall(leftBottom: Vector3, leftTop: Vector3, rightTop: Vector3,
                     rightBottom: Vector3): void {
        this.buildSurface(leftBottom, leftTop, rightTop, rightBottom);
    }
}


export class BlankWallBuilder extends WallBuilder {
    public buildWall(leftBottom: Vector3, leftTop: Vector3, rightTop: Vector3,
                     rightBottom: Vector3): void {
        const alignStart: Vector3 = rightBottom.subtract(leftBottom).scale(0.4);
        const alignEnd: Vector3 = leftBottom.subtract(rightBottom).scale(0.4);
        const matrix: Matrix = BABYLON.Matrix.RotationY(0.5 * Math.PI);

        this.buildSurface(leftBottom, leftTop, leftTop.add(alignStart), leftBottom.add(alignStart),);

        const alignInsetStart: Vector3 = BABYLON.Vector3.TransformCoordinates(alignStart, matrix).scale(0.7);

        this.buildSurface(leftBottom.add(alignStart), leftTop.add(alignStart),
            leftTop.add(alignStart).subtract(alignInsetStart),
            leftBottom.add(alignStart).subtract(alignInsetStart),
            this.wallDarkColor,
        );

        this.buildSurface(
            leftBottom.add(alignStart).subtract(alignInsetStart),
            leftTop.add(alignStart).subtract(alignInsetStart),
            rightTop.add(alignEnd).subtract(alignInsetStart),
            rightBottom.add(alignEnd).subtract(alignInsetStart),
            this.wallDarkColor,
        );

        this.buildSurface(
            rightBottom.add(alignEnd).subtract(alignInsetStart),
            rightTop.add(alignEnd).subtract(alignInsetStart), rightTop.add(alignEnd),
            rightBottom.add(alignEnd), this.wallDarkColor,
        );

        this.buildSurface(rightBottom.add(alignEnd), rightTop.add(alignEnd), rightTop, rightBottom,);
    }
}


export class VerticalWindowBuilder extends WallBuilder {
    public buildWall(leftBottom: Vector3, leftTop: Vector3, rightTop: Vector3,
                     rightBottom: Vector3): void {
        const alignStart: Vector3 = rightBottom.subtract(leftBottom).scale(0.2);
        const alignEnd: Vector3 = leftBottom.subtract(rightBottom).scale(0.2);
        const matrix: Matrix = BABYLON.Matrix.RotationY(0.5 * Math.PI);

        this.buildSurface(leftBottom, leftTop, leftTop.add(alignStart), leftBottom.add(alignStart));

        const alignInsetStart: Vector3 = BABYLON.Vector3.TransformCoordinates(alignStart, matrix).scale(0.4);

        this.buildSurface(leftBottom.add(alignStart), leftTop.add(alignStart),
            leftTop.add(alignStart).subtract(alignInsetStart),
            leftBottom.add(alignStart).subtract(alignInsetStart), this.wallDarkColor,
        );

        this.buildSurface(
            leftBottom.add(alignStart).subtract(alignInsetStart),
            leftTop.add(alignStart).subtract(alignInsetStart),
            rightTop.add(alignEnd).subtract(alignInsetStart),
            rightBottom.add(alignEnd).subtract(alignInsetStart), this.wallDarkColor,
        );

        this.buildSurface(
            rightBottom.add(alignEnd).subtract(alignInsetStart),
            rightTop.add(alignEnd).subtract(alignInsetStart), rightTop.add(alignEnd),
            rightBottom.add(alignEnd), this.wallDarkColor,
        );

        this.buildSurface(rightBottom.add(alignEnd), rightTop.add(alignEnd), rightTop, rightBottom,);
    }
}


export class HorizontalWindowBuilder extends WallBuilder {
    public buildWall(leftBottom: Vector3, leftTop: Vector3, rightTop: Vector3, rightBottom: Vector3): void {
        const alignStart: Vector3 = leftTop.subtract(leftBottom).scale(0.2);

        this.buildSurface(leftBottom, leftBottom.add(alignStart), rightBottom.add(alignStart), rightBottom);
        this.buildSurface(rightTop, rightTop.subtract(alignStart), leftTop.subtract(alignStart), leftTop);
        this.buildSurface(leftTop, leftTop.subtract(alignStart), rightTop.subtract(alignStart), rightTop);

        this.buildSurface(
            leftBottom.add(alignStart),
            leftTop.subtract(alignStart),
            rightTop.subtract(alignStart),
            rightBottom.add(alignStart),
            this.windowColor, true,
        );
    }
}