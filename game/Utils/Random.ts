import BABYLON from "../../static/babylon";


export class Random {

    public seed: number = Math.random() * 10000;

    constructor(seed?: number) {
        if (seed) {
            this.seed = seed;
        }
    }

    public get number(): number {
        const x = Math.sin(this.seed) * 10000;
        this.seed++;

        return x - Math.floor(x);
    }

    public get Vector2(): BABYLON.Vector2 {
        return new BABYLON.Vector2(this.number, this.number);
    }

    public get Vector3(): BABYLON.Vector3 {
        return new BABYLON.Vector3(this.number, this.number, this.number);
    }

    public get boolean(): boolean {
        return this.number < 0.5;
    }


    public random(): number {
        return this.number;
    }

    public range(start: number, end: number, int: boolean = true): number {
        let floor = x => Math.floor(x);
        if (!int) floor = x => x;

        return start + floor(this.number * (end - start));
    }

    public choose(items: any[]): any {
        if (items.length === 0) {
            return undefined;
        }

        return items[Math.floor(this.number * items.length)];
    }

    public grab(items: any[]): any {
        if (items.length === 0) {
            return undefined;
        }
        
        return items.splice(Math.floor(this.number * items.length), 1)[0];
    }

}
