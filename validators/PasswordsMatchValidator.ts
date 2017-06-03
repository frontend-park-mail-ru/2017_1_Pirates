import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {JSONParserService} from "jsworks/dist/dts/Parser/JSON/JSONParserService";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


let firstPassword: string;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class PasswordsMatch1Validator {

    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            firstPassword = args['value'];
            resolve();
        });
    }
}


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class PasswordsMatch2Validator {

    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            if (firstPassword === args['value']) {
                resolve();
                return;
            }

            reject('Пароли не совпадают!');
        });
    }
}
