import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel";
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;

export interface ScoreModelFields {
    login: string;
    score: number;
    kills: number;
    max_combo: number;
}

@JSWorks.Model
export class ScoreModel implements IModel, ScoreModelFields {
    @JSWorks.ModelField
    login: string;

    @JSWorks.ModelField
    score: number;

    @JSWorks.ModelField
    kills: number;

    @JSWorks.ModelField
    max_combo: number;


    public total: number = 0;


    @JSWorks.ModelQueryMethod
    public query(params: IQuery): Promise<ScoreModel[]> {
        return new Promise<ScoreModel[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/scores/select`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify(params),
                { 'Content-Type': 'application/json' },
            ).then((data: any) => {
                const models: ScoreModel[] = [];

                data.entries.forEach((item) => {
                    models.push((<any> this).from(item));
                    models[models.length - 1].total = data.total;
                });

                resolve(models);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    @JSWorks.ModelCreateMethod
    public create(): Promise<any> {
        console.dir(this);
        console.log(this.login);
        return new Promise<any>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/scores/create`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                console.log(data);
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}