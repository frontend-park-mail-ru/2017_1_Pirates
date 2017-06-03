import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractController} from "../AbstractController";
import {RealmClass} from "../../game/Realm/Realm";


declare const JSWorks: JSWorksLib;
declare const Realm: RealmClass;


@JSWorks.Controller
export class SinglePlayerController extends AbstractController {

    public isGame: boolean = true;


    public onNavigate(args: object):void {
        super.onNavigate(args);

        Realm.changeState('offlineGame');
    }
}