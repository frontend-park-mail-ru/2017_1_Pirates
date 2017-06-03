import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {WindowComponent} from "./WindowComponent";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class WindowController {

    public view: View;
    public component: WindowComponent;

}
