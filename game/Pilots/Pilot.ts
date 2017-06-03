import {StarShip} from "../Models/StarShip";


export abstract class Pilot {

    public ship: StarShip;


    constructor(ship: StarShip) {
        this.ship = ship;
    }


    public abstract think(): void;

}
