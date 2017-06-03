import BABYLON from "../../static/babylon";
import {StarShip} from "../Models/StarShip";
import {RealmClass} from "./Realm";
import {IObject} from "../ObjectFactory/ObjectFactory";


declare const Realm: RealmClass;


export class RealmScene extends BABYLON.Scene {

    public loader: BABYLON.AssetsManager;
    public bonusSound: BABYLON.Sound;
    public engineSound: BABYLON.Sound;
    public menuMusic: BABYLON.Sound;
    public gameMusic: BABYLON.Sound;
    public laserSound: BABYLON.Sound;
    public explosionSound: BABYLON.Sound;
    public hoverSound: BABYLON.Sound;
    public clickSound: BABYLON.Sound;


    constructor(engine: BABYLON.Engine) {
        super(engine);

        this.loader = new BABYLON.AssetsManager(this);
        let task;

        task = this.loader.addBinaryFileTask('bonus task', '/static/sounds/bonus.ogg');
        task.onSuccess = (task) => {
            this.bonusSound = new BABYLON.Sound('bonus', task.data, this, null,
                    { loop: false, autoplay: false });
        };

        task = this.loader.addBinaryFileTask('engine task', '/static/sounds/ship.ogg');
        task.onSuccess = (task) => {
            this.engineSound = new BABYLON.Sound('ship', task.data, this, null,
                { loop: true, autoplay: false });
            this.engineSound.setVolume(0.0);
        };

        task = this.loader.addBinaryFileTask('menu task', '/static/music/menu2.ogg');
        task.onSuccess = (task) => {
            this.menuMusic = new BABYLON.Sound('menu', task.data, this, null,
                { loop: true, autoplay: false });
            this.menuMusic.setVolume(0.1);
        };

        task = this.loader.addBinaryFileTask('game task', '/static/music/game.ogg');
        task.onSuccess = (task) => {
            this.gameMusic = new BABYLON.Sound('game', task.data, this, null,
                { loop: true, autoplay: false });
            this.gameMusic.setVolume(0.17);
        };

        task = this.loader.addBinaryFileTask('laser task', '/static/sounds/laser.ogg');
        task.onSuccess = (task) => {
            this.laserSound = new BABYLON.Sound('shoot', task.data, this, null,
                { loop: false, autoplay: false });
            this.laserSound.setVolume(0.6);
        };

        task = this.loader.addBinaryFileTask('explosion task', '/static/sounds/explosion.ogg');
        task.onSuccess = (task) => {
            this.explosionSound = new BABYLON.Sound('explosion', task.data, this, null,
                { loop: false, autoplay: false });
            this.explosionSound.setVolume(0.8);
        };

        task = this.loader.addBinaryFileTask('hover task', '/static/sounds/click.ogg');
        task.onSuccess = (task) => {
            this.hoverSound = new BABYLON.Sound('hover', task.data, this, null,
                { loop: false, autoplay: false });
            this.hoverSound.setVolume(2.0);
        };

        task = this.loader.addBinaryFileTask('click task', '/static/sounds/click2.ogg');
        task.onSuccess = (task) => {
            this.clickSound = new BABYLON.Sound('click', task.data, this, null,
                { loop: false, autoplay: false });
            this.clickSound.setVolume(2.0);
        };

    }


    public load(): void {
        this.loader.load();
    }


}
