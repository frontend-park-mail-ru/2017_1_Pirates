

import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../models/UserModel";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class LoadingController {

    public onCreate(): void {
    }

    public onNavigate(args: object): void {
        if (args && args['logout']) {
            (<UserModel> JSWorks.applicationContext.modelHolder
                .getModel('UserModel')).logout().then(r => JSWorks.applicationContext.router.navigate(
                JSWorks.applicationContext.routeHolder.getRoute('MenuRoute'),
                {},
            ));

            return;
        }

        // window.setTimeout(() => {
        //     JSWorks.applicationContext.router.navigate(
        //         JSWorks.applicationContext.routeHolder.getRoute('MenuRoute'),
        //         {},
        //     )
        // }, 10);
    }

}