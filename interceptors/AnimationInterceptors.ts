import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement"

declare const JSWorks: JSWorksLib;

@JSWorks.Interceptor({ type: JSWorks.InterceptorType.RouteBeforeNavigateInterceptor })
export class AnimationBeforeInterceptor {

    public intercept(args: object): Promise<any> {

        if (!args['prevPage']) {
            return Promise.resolve();
        }

        return new Promise((res, rej) => {

            const container: SimpleVirtualDOMElement = args['prevPage'].view.DOMRoot.querySelector('.base-container');
            container.setStyleAttribute('opacity','0');

            window.setTimeout(() => {
                res();
            }, 500)
        });
    }
}

@JSWorks.Interceptor({ type: JSWorks.InterceptorType.RouteAfterNavigateInterceptor })
export class AnimationAfterInterceptor {

    public intercept(args: object): Promise<any> {
        return new Promise((res, rej) => {

            const container: SimpleVirtualDOMElement = args['nextPage'].view.DOMRoot.querySelector('.base-container');
            container.setStyleAttribute('opacity','1');

            window.setTimeout(() => {
                res();
            }, 500)
        });
    }
}