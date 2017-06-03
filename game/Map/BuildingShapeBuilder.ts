import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import Vector2 = BABYLON.Vector2;
import Vector3 = BABYLON.Vector3;
import Matrix = BABYLON.Matrix;
import Color4 = BABYLON.Color4;
import StandardMaterial = BABYLON.StandardMaterial;
import {Builder} from "./Builder";
import {
    WallBuilder, BlankBuilder, BlankWallBuilder, VerticalWindowBuilder,
    HorizontalWindowBuilder
} from "./WallBuilder";
import {RoofBuilder, SquareRoofBuilder} from "./RoofBuilder";


declare const Realm: RealmClass;


export abstract class BuildingShapeBuilder extends Builder {
    public readonly floorHeight: number = 4;

    protected buildWallAligned(start: Vector3, height: number, width: number, align: Vector3,
                               builder: WallBuilder, initOffset: number, index: number, vertIndex: number,
                               customStart?: Vector3, customEnd?: Vector3): void {
        const alignNormalized: Vector3 = align.clone().normalize();
        let alignStart: Vector3 = start.add(alignNormalized.clone().scale(initOffset + width * index));
        let alignEnd: Vector3 = start.add(alignNormalized.clone().scale(initOffset + width * (index + 1)));

        if (customStart && customEnd) {
            alignStart = customStart;
            alignEnd = customEnd;
        }

        const nearBottom: Vector3 = new Vector3(alignStart.x, height * vertIndex, alignStart.z);
        const farBottom: Vector3 = new Vector3(alignEnd.x, height * vertIndex, alignEnd.z);
        const farTop: Vector3 = farBottom.add(new Vector3(0, height, 0));
        const nearTop: Vector3 = nearBottom.add(new Vector3(0, height, 0));

        builder.buildWall(nearBottom, nearTop, farTop, farBottom);
    }

    public abstract buildRoof(): void;
}


export class RectangularBuildingShapeBuilder extends BuildingShapeBuilder {
    public xParam: number = this.args['xParam'] || this.random.range(
            this.args['minXParam'] || 15, this.args['maxXParam'] || 25, false);
    public zParam: number = this.args['zParam'] || this.random.range(
            this.args['minZParam'] || 15, this.args['maxZParam'] || 25, false);


    public build(index: number): void {
        if (this.xParam < this.zParam) {
            const b = this.xParam;
            this.xParam = this.zParam;
            this.zParam = b;
        }

        let builders: any[] = [BlankBuilder, BlankWallBuilder, VerticalWindowBuilder,
                HorizontalWindowBuilder];

        if (Realm['_generateBuildingForMenu']) {
            builders = [BlankBuilder, BlankWallBuilder];
        }

        const patterns: WallBuilder[][] = [];
        const xTiles: number = Math.floor(this.xParam * 2 / this.floorHeight);
        const zTiles: number = Math.floor(this.zParam * 2 / this.floorHeight);

        const corner: WallBuilder = new (this.random.choose([BlankBuilder, BlankWallBuilder]))
                (this.random, this.darks, this.lights);

        const x1Pattern: WallBuilder[] = [];
        const z1Pattern: WallBuilder[] = [];
        const x2Pattern: WallBuilder[] = [];
        const z2Pattern: WallBuilder[] = [];


        const makePattern = (pattern: WallBuilder[], tiles: number,
                             factory?: (index: number) => WallBuilder) => {
            if (!factory) {
                factory = (index: number): WallBuilder => {
                    if (index === 0 || index === tiles - 1) {
                        return corner;
                    }

                    return new (this.random.choose(builders))(this.random, this.darks, this.lights, this.args);
                }
            }

            pattern.push(factory(0));

            for (let i = 1; i < tiles - 1; i++) {
                pattern.push(factory(i));
            }

            pattern.push(factory(tiles - 1));
        };


        if (index < this.args['floors'] - this.random.range(3, 6) && index > this.random.range(2, 6)) {
            makePattern(x1Pattern, xTiles);
            makePattern(z1Pattern, zTiles);
            makePattern(x2Pattern, xTiles);
            makePattern(z2Pattern, zTiles);
        } else if (index === this.args['floors'] - 1 || index === 0) {
            const blank: BlankBuilder = new BlankBuilder(this.random, this.darks, this.lights, this.args);

            makePattern(x1Pattern, xTiles, () => blank);
            makePattern(z1Pattern, zTiles, () => blank);
            makePattern(x2Pattern, xTiles, () => blank);
            makePattern(z2Pattern, zTiles, () => blank);
        } else {
            makePattern(x1Pattern, xTiles, () => corner);
            makePattern(z1Pattern, zTiles, () => corner);
            makePattern(x2Pattern, xTiles, () => corner);
            makePattern(z2Pattern, zTiles, () => corner);
        }

        patterns.push(x1Pattern, z1Pattern, x2Pattern, z2Pattern);
        this.buildPatterns(index, patterns);
    }


    // Pattern order is: left, top, right, bottom
    protected buildPatterns(index: number, patterns: WallBuilder[][]): void {
        const leftStart: Vector3 = new Vector3(-this.xParam, index * this.floorHeight, -this.zParam);
        const leftAlign: Vector3 = new Vector3(2 * this.xParam, 0, 0);

        const topStart: Vector3 = leftStart.add(leftAlign);
        const topAlign: Vector3 = new Vector3(0, 0, 2 * this.zParam);

        const rightStart: Vector3 = topStart.add(topAlign);
        const rightAlign: Vector3 = new Vector3(-2 * this.xParam, 0, 0);

        const bottomStart: Vector3 = rightStart.add(rightAlign);
        const bottomAlign: Vector3 = new Vector3(0, 0, -2 * this.zParam);


        const blankBuilder: BlankBuilder = new BlankBuilder(this.random, this.darks, this.lights);
        const order: Vector3[][] = [ [leftStart, leftAlign], [topStart, topAlign], [rightStart, rightAlign],
                [bottomStart, bottomAlign] ];

        order.forEach((order: Vector3[], i: number) => {
            const offset: number = 0.5 * (order[1].length() - Math.floor(patterns[i].length * this.floorHeight));

            this.buildWallAligned(order[0], this.floorHeight, this.floorHeight, order[1], blankBuilder,
                    offset, 0, index, order[0], order[0].add(order[1].clone().normalize().scale(offset)));

            patterns[i].forEach((builder: WallBuilder, j: number) => {
                this.buildWallAligned(order[0], this.floorHeight, this.floorHeight, order[1], builder,
                        offset, j, index);
            });

            this.buildWallAligned(order[0], this.floorHeight, this.floorHeight, order[1], blankBuilder,
                    offset, 0, index,
                    order[0].add(order[1]).subtract(order[1].clone().normalize().scale(offset)),
                    order[0].add(order[1]));
        });
    }


    public buildRoof(): void {
        const roofs = [SquareRoofBuilder];
        const roof: RoofBuilder = new (this.random.choose(roofs))(this.random, this.darks, this.lights,
                this.args);

        const leftStart: Vector3 = new Vector3(-this.xParam, this.args['floors'] * this.floorHeight,
                -this.zParam);
        const topStart: Vector3 = leftStart.add(new Vector3(2 * this.xParam, 0, 0));
        const rightStart: Vector3 = topStart.add(new Vector3(0, 0, 2 * this.zParam));
        const bottomStart: Vector3 = rightStart.add(new Vector3(-2 * this.xParam, 0, 0));

        roof.buildRoof([leftStart, topStart, rightStart, bottomStart]);
    }

}


export class SquareBuildingShapeBuilder extends RectangularBuildingShapeBuilder {
    public build(index: number): void {
        // this.xParam = this.zParam;

        super.build(index);
    }
}


export class HexagonBuildingShapeBuilder extends BuildingShapeBuilder {
    public build(index: number): void {

    }

    public buildRoof(): void {

    }
}


export class Complex1BuildingShapeBuilder extends BuildingShapeBuilder {
    public build(index: number): void {

    }

    public  buildRoof(): void {

    }
}