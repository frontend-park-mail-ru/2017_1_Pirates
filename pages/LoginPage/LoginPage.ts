import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'LoginView', controller: 'LoginController' })
export class LoginPage {

    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;

    @(<any> JSWorks.ComponentProperty())
    public error: string;

    @(<any> JSWorks.ComponentProperty())
    public loginOrEmail: string;

}