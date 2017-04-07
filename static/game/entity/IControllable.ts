declare const BABYLON;


export interface IControllable {

    speed: number;
    joystickMoved(x: number, y: number);
    joystickPressed();

}

