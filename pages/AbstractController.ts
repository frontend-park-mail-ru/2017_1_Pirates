import {RealmClass} from "../game/Realm/Realm";
import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare let Realm: RealmClass;
declare const JSWorks: JSWorksLib;


export abstract class AbstractController {

    public gameCanvasId: string = 'game-canvas';
    public isGame: boolean = false;
    private pointerLockSet: boolean = false;


    public onNavigate(args?: object): void {

        if (!JSWorks.config['serviceWorkerEnabled'] && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/static/serviceWorker/serviceWorker.js')
                .then((registration) => {
                    console.log('ServiceWorker registration', registration);
                    JSWorks.config['serviceWorkerEnabled'] = true;
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            JSWorks.config['serviceWorkerEnabled'] = true;
        }

        if (!Realm) {
            Realm = new RealmClass(this.gameCanvasId);
            Realm.init();
        } else {
            Realm.changeState('menu');
            (<any> this).view.DOMRoot.querySelector('.base-container').setStyleAttribute(
                    'visibility', 'visible');
        }

        if (!this.isGame || this.pointerLockSet) {
            return;
        }

        document.querySelector('.game-content').addEventListener('click', () => {
            Realm.setPointerLock();
        });

        this.pointerLockSet = true;
    }

}
