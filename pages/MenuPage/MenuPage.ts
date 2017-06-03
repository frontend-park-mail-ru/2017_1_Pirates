'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'MenuView', controller: 'MenuController' })
export class MenuPage {


    @(<any> JSWorks.ComponentProperty())
    public testA: string;


    @(<any> JSWorks.ComponentProperty({ onChange: 'onTestBChange' }))
    public testB: string = 'default';


    @(<any> JSWorks.ComponentProperty({ mapping: '#h2@innerHTML' }))
    public testC: string;

    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;


}