import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {AbstractController} from "../AbstractController";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class SignUpController extends AbstractController {

    public view: View;
    public form: FormForElement;


    public onCreate(): void {
        this.form = <FormForElement> this.view.DOMRoot.querySelector('#SignUpForm');

        this.form.onSuccess = (form: FormForElement, data: object): boolean => {
            this.form.clear();

            window.setTimeout(() => {
                JSWorks.applicationContext.router.navigate(
                    JSWorks.applicationContext.routeHolder.getRoute('LoginRoute'),
                    {},
                )
            }, 10);

            return true;
        }
    }


    public onNavigate(args: object): void {
        super.onNavigate(args);
        this.onCreate();
    }

}
