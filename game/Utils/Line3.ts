import BABYLON from "../../static/babylon";


export class Line3 {

    public start: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public end: BABYLON.Vector3 = BABYLON.Vector3.Zero();


    constructor(start: BABYLON.Vector3, end: BABYLON.Vector3) {
        this.start = start;
        this.end = end;
    }

    public static Zero(): Line3 {
        return new Line3(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero());
    }


    public length(): number {
        return BABYLON.Vector3.Distance(this.start, this.end);
    }

    public lengthSquared(): number {
        return BABYLON.Vector3.DistanceSquared(this.start, this.end);
    }

}
