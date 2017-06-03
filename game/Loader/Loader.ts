import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";


declare const Realm: RealmClass;


export class Loader {

    private _count: number = 0;
    private _loaded: number = 0;
    private _error: boolean = false;
    private _hash: object = {};

    public taskAdder: (self, name: string, root: string, file: string) => any = () => {};
    public resultGetter: (self, task: any) => any = () => { return null; };

    private resolve;
    private reject;
    private promise: Promise<any>;


    constructor() {
        this.promise = new Promise<any>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }


    public get count(): number {
        return this._count;
    }

    public get loaded(): number {
        return this._loaded;
    }

    public get error(): boolean {
        return this._error;
    }

    public retrieve(name: string) {
        return this._hash[name];
    }


    public load(): Promise<any> {
        if (this._count === 0) {
            return Promise.resolve();
        }

        return this.promise;
    }


    public queue(name: string, root: string, file: string) {
        if (this._hash[name]) {
            return;
        }

        const task = this.taskAdder(this, name, root, file);
        this._hash[name] = true;
        this._count++;

        task.onSuccess = (task) => {
            this._loaded++;
            this._hash[name] = this.resultGetter(this, task);

            if ((this._loaded === this._count) && !this._error) {
                this.resolve();
            }
        };

        task.onError = (task) => {
            this._error = true;
            this._hash = {};
            this._loaded = 0;
            this._count = 0;

            this.reject(`"${file}" in "${root}"`);
        }
    }

}
