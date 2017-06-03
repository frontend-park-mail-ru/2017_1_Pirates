

import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel";

declare const JSWorks: JSWorksLib;

export interface UserModelFields {
    id: number;
    login: string;
    email: string,
    password?: string;
}

@JSWorks.Model
export class UserModel implements UserModelFields, IModel {

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    id: number;

    @JSWorks.ModelField
    login: string;

    @JSWorks.ModelField
    email: string;

    @JSWorks.ModelField
    password: string;
    odaf: IModel;

    constructor() {}


    @JSWorks.ModelCreateMethod
    public create(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(
                JSWorks.config['backendURL'] + `/user/create`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(<UserModel> (<IModel> this).from(data));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public current(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(
                JSWorks.config['backendURL'] + '/session/current',
                JSWorks.HTTPMethod.GET,
            ).then((data) => {
                if (data['status'] === -1) {
                    (<IModel> this).apply(data);
                } else {
                    resolve((<UserModel> (<IModel> this).from(data)));
                }
                resolve(this);
            }).catch((err) => {
                resolve(this);
            });
        });
    }


    public signin(): Promise<UserModel> {
        console.dir(this);
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/session/login',
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ login_or_email: this.email, password: this.password }),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                if (data['status'] !== -1) {
                    reject(data['error']);
                    return;
                }

                (<IModel> this).apply(data);
                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public read(id?: number): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(
                JSWorks.config['backendURL'] + `/user/${id || this.id}`,
                JSWorks.HTTPMethod.GET
            ).then((data) => {
                (<IModel> this).apply(data);
                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public update(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(
                JSWorks.config['backendURL'] + `/user/update`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                (<IModel> this).apply(data);
                (<IModel> this).setDirty(false);

                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public logout(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(
                JSWorks.config['backendURL'] + '/session/logout',
                JSWorks.HTTPMethod.POST
            ).then((data) => {
                resolve();
            }).catch((err) => {
                resolve();
            });
        });
    }

    @JSWorks.ModelDeleteMethod
    public ['delete'](): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/user/delete`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ id: this.id }),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public loggedIn(): boolean {
        return this.id !== undefined;
    }

}