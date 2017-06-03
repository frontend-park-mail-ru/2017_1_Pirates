import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class LoadingBlockController {

    public view: View;


    public onCreate(): void {
        const load: SimpleVirtualDOMElement = this.view.DOMRoot.querySelector('.balls');

        const radius = 14;
        const circlesNumber = 8;
        const wrap = 64 - 4;

        for (let i = 0; i < circlesNumber; i++) {
            const f = 2 / circlesNumber * i * Math.PI;
            const circle: SimpleVirtualDOMElement = JSWorks.applicationContext.serviceHolder.
                    getServiceByName('SimpleVirtualDOM').createElement('SPAN');

            circle.setAttribute('class', 'circle flicker');
            circle.style['left'] = (Math.cos(f) * radius + wrap / 2) + 'px';
            circle.style['top'] = (Math.sin(f) * radius + wrap / 2) + 'px';

            load.appendChild(circle);
        }
    }

}
