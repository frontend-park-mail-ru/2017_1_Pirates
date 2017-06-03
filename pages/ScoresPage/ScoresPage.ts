import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'ScoresView', controller: 'ScoresController' })
export class ScoresPage {

    @(<any> JSWorks.ComponentProperty())
    public dummy: string = '';


    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;

}