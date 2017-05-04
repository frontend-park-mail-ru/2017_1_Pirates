import {EventType} from './EventType';


declare const BABYLON;
declare const JSWorks;


export class Loader {

    private loader: any;

    private _count: number = 0;
    private _loaded: number = 0;
    private _error: boolean = false;
    private _hash: object = {};

    public taskAdder: (self, name: string, root: string, file: string) => any = () => {};
    public resultGetter: (self, task: any) => any = () => { return null; };


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


    constructor(loader: any) {
        this.loader = loader;
    }


    public load() {
        if (this._count === 0) {
            (<any> this).emitEvent({ type: EventType.LOAD_SUCCESS });
        }
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
                (<any> this).emitEvent({ type: EventType.LOAD_SUCCESS });
            }
        };

        task.onError = (task) => {
            this._error = true;
            this._hash = {};
            this._loaded = 0;
            this._count = 0;

            (<any> this).emitEvent({ type: EventType.LOAD_FAIL });
        }
    }

}
