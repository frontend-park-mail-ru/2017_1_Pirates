import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractController} from "../AbstractController";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel} from "../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class MenuController extends AbstractController{


    public onNavigate(args: object): void {
        super.onNavigate(args);

        if (args && args['logout']) {
            (<UserModel> JSWorks.applicationContext.modelHolder
                .getModel('UserModel'))
                .logout()
                .then(() => { (<any> this).component.currentUser = undefined });
            return;
        }
    }
}
