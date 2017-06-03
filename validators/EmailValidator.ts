import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractNetworkValidator} from "./AbstractNetworkValidator";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class EmailValidator extends AbstractNetworkValidator {

    public relUrl: string = '/validator/email';

}
