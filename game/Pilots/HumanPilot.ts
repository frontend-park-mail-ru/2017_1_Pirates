import BABYLON from "../../static/babylon";
import {Pilot} from "./Pilot";
import {StarShip} from "../Models/StarShip";
import {RealmClass} from "../Realm/Realm";


declare const Realm: RealmClass;


export class HumanPilot extends Pilot {

    public canControl: boolean = false;

    public movementLag: number = 50;
    private movementX: number = 0;
    private movementY: number = 0;


    constructor(ship: StarShip) {
        super(ship);

        document.addEventListener('keydown', () => { this.onKeyDown(); });
        document.addEventListener('mousemove', (ev) => { this.onMouseMove(ev); });
        document.addEventListener('mousedown', (ev) => { this.onMouseDown(); });
    }


    public grabShip(): void {
        Realm.camera.follow(this.ship);
        this.ship.canMove = false;
    }

    public toggleControl(value: boolean): void {
        this.canControl = value;
    }


    protected onKeyDown(): void {
    }


    protected onMouseMove(event: MouseEvent): void {
        if (!this.canControl || !Realm.pointerLocked) {
            return;
        }

        const movX: number = event.movementX ||
                (<any> event).mozMovementX ||
                (<any> event).webkitMovementX || 0;
        const movY: number = event.movementY ||
            (<any> event).mozMovementY ||
            (<any> event).webkitMovementY || 0;

        const movSpeed = this.ship.speed / this.ship.maxSpeed;

        this.movementX = Realm.calculateLag(this.movementX, this.movementX + movX * 2.0 * movSpeed,
                this.movementLag);
        this.movementY = Realm.calculateLag(this.movementY, this.movementY + movY * 4.0 * movSpeed,
            this.movementLag);
        this.ship.setRoll(movX * 0.2 * movSpeed);
    }


    protected onMouseDown(): void {
        if (!this.canControl || !Realm.pointerLocked) {
            return;
        }

        this.ship.shoot();
    }


    public think(): void {
        if (this.canControl) {
            this.ship.mixAim(this.ship.position.add(new BABYLON.Vector3(
                -1,
                -this.movementY,
                this.movementX,
            )));
        }
    }

}
