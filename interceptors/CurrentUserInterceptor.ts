import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {CurrentUserHelper} from "../helpers/CurrentUserHelper";
import {UserModel} from "../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({type: JSWorks.InterceptorType.RouteBeforeNavigateInterceptor})
export class CurrentUserInterceptor {

    public intercept(args: object): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!args['nextPage']) {
                return;
            }

            return (<UserModel>JSWorks.applicationContext.modelHolder
                .getModel('UserModel'))
                .current()
                .then((user: UserModel) => {
                    args['nextPage']['currentUser'] = user;
                    resolve();
                });
        });
    }

}
