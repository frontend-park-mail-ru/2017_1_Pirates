import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../models/UserModel";


declare const JSWorks: JSWorksLib;


export class CurrentUserHelper {

    public static _currentUser: UserModel;


    public static get currentUser(): Promise<UserModel> {
        const model: UserModel = <UserModel> JSWorks.applicationContext.modelHolder.getModel('UserModel');

        if (!CurrentUserHelper._currentUser) {
            return new Promise<UserModel>((resolve, reject) => {
                model.current().then((user: UserModel) => {
                    CurrentUserHelper.currentUser = Promise.resolve(user);
                    resolve(user);
                });
            });
        }

        return Promise.resolve(CurrentUserHelper._currentUser);
    }


    public static set currentUser(value: Promise<UserModel>) {
        value.then((result: UserModel) => {
            CurrentUserHelper._currentUser = result;
        });
    }


}
