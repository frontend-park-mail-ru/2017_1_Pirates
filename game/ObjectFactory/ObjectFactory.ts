import {Random} from "../Utils/Random";
import {RealmClass} from "../Realm/Realm";


declare const Realm: RealmClass;


export interface IObject {
    onCreate(): void;
    onGrab(): void;
    onFree(): void;
    onRender(): void;
    onDelete(): void;
}


class Allocated {
    objects: IObject[] = [];
    free: IObject[] = [];
    notified: boolean = false;
}


export type TFactory = (index?: number) => IObject;


interface IObjectProto {
    name: string;
    amount: number;
    factory: TFactory;
    created: boolean;
}



export class ObjectFactory {

    public objects: Map<string, Allocated> = new Map<string, Allocated>();
    public objectFactories: Map<string, IObjectProto> = new Map<string, IObjectProto>();
    public logging: boolean = false;


    public addObject(name: string, amount: number, factory: TFactory): void {
        this.objectFactories.set(name, {name, amount, factory, created: false});
    }


    public removeObject(name: string): void {
        this.freeAll(name);
        const objects: Allocated = this.objects.get(name);

        if (!objects) {
            return;
        }

        objects.objects.forEach((object: IObject) => {
            object.onDelete();

            if (object['dispose']) {
                object['dispose']();
                console.log('disposing', object);
            }
        });

        this.objects.delete(name);
        this.objectFactories.delete(name);
    }


    public hasObject(name: string): boolean {
        return this.objectFactories.has(name);
    }


    public addObjectIfNone(name: string, amount: number, factory: TFactory): void {
        if (!this.hasObject(name)) {
            this.addObject(name, amount, factory);
        }
    }


    private showLoadingText(): Promise<any> {
        return new Promise<any>((resolve) => {
            Realm.toggleLoading(true, 'Генерация структур... Это может занять некоторое время.');

            window.setTimeout(() => {
                resolve();
            }, 200);
        });
    }


    public load(): Promise<any> { return this.showLoadingText().then(() => {
        const promises: Promise<any>[] = [];

        this.objectFactories.forEach((objectProto: IObjectProto, name: string) => {
            this.objects.set(name, new Allocated());

            for (let i = 0; i < objectProto.amount; i++) {
                this.objectFactories.delete(name);

                promises.push(new Promise<any>((res) => {
                    window.setTimeout(() => {
                        const object: IObject = objectProto.factory(i);
                        (<any> object).renderingGroupId = 1;

                        this.objects.get(name).objects.push(object);
                        this.free(name, object);

                        this.load().then(() => {
                            res();
                        });
                    }, 0);
                }));
            }
        });

        return Promise.all(promises).then(() => {
            Realm.setRenderGroupIDs();
            //Realm.toggleLoading(false);
        });
    }); }


    public notifyLoaded(): void {
        this.objects.forEach((allocated: Allocated) => {
            allocated.objects.forEach((object: IObject) => {
                if (allocated.notified) {
                    return;
                }

                object.onCreate();
                allocated.notified = true;
            });
        });
    }


    public notifyRendered(): void {
        this.objects.forEach((allocated: Allocated) => {
            allocated.objects.forEach((object: IObject) => {
                if (!object['_free']) {
                    object.onRender();
                }
            });
        });
    }


    public grab(name: string): IObject {
        if (this.logging) {
            console.log('Grabbing', name);
        }

        const alloc: Allocated = this.objects.get(name);

        if (alloc.free.length === 0) {
            throw new Error(`All meshes of type "${name}" are allocated!`);
        }

        const object: IObject = alloc.free.pop();
        object['_free'] = false;
        object.onGrab();

        return object;
    }


    public grabRandom(name: string, random: Random): IObject {
        if (this.logging) {
            console.log('Grabbing', name);
        }

        const alloc: Allocated = this.objects.get(name);

        if (alloc.free.length === 0) {
            throw new Error(`All meshes of type "${name}" are allocated!`);
        }

        const object: IObject = random.grab(alloc.free);
        object['_free'] = false;
        object.onGrab();

        return object;
    }


    public free(name: string, object: IObject): void {
        if (this.logging) {
            console.log('Freeing', name);
        }

        const alloc: Allocated = this.objects.get(name);

        if (!alloc || !object) {
            return;
        }

        object.onFree();
        object['_free'] = true;
        alloc.free.push(object);
    }


    public freeAll(name: string): void {
        if (this.logging) {
            console.log('Freeing all of', name);
        }

        const alloc: Allocated = this.objects.get(name);

        if (!alloc) {
            return;
        }

        alloc.objects.forEach((object: IObject) => {
            this.free(name, object);
        });
    }


    public hasFree(name: string): boolean {
        const alloc: Allocated = this.objects.get(name);
        return alloc && alloc.free.length > 0;
    }


    public replaceFreeObject(name: string, newObject: IObject): void {
        const alloc: Allocated = this.objects.get(name);

        if (!alloc || alloc.free.length === 0) {
            return;
        }

        alloc.free.pop().onDelete();
        alloc.free.push(newObject);
        newObject.onCreate();
        newObject.onFree();
    }

}
