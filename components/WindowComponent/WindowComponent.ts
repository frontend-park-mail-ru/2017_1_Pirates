import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Component({ view: 'WindowView', controller: 'WindowController' })
export class WindowComponent {

    public view: View;

    public windows: SimpleVirtualDOMElement[] = [];
    private zOffset: number = 10000;


    public openWindow(view: View) {
        const window: SimpleVirtualDOMElement = this.view.DOMRoot.querySelector('.window-template')
            .querySelector('.window-curtain').cloneNode();

        window.querySelector('.window-body').appendChild(view.DOMRoot);
        window.setStyleAttribute('z-index', this.zOffset + this.windows.length);

        this.view.DOMRoot.querySelector('.window-root').appendChild(window);
        this.windows.push(window);
    }


    public closeLastWindow() {
        if (this.windows.length === 0) {
            return;
        }

        this.windows[this.windows.length - 1].parentNode.removeChild(this.windows.pop());
    }

}