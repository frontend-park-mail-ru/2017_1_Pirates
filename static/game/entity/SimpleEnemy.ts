import {Entity} from './entity';
import {MotionScene} from "../scenes/scene";


declare const BABYLON;
declare const JSWorks;


export class SimpleEnemy extends Entity {


	private fired: boolean = false;
	private firedCount: number = 0;


	constructor(name: string, scene: MotionScene) {
		super(name, scene, false);
		this.speed *= -1 * Math.random() * 0.1;
		this.health = 1;
	}


	public onMeshesLoaded(event, emitter) {
		super.onMeshesLoaded(event, emitter);
		this.light.setEnabled(false);

		(<any> this).ship.rotation.y = Math.PI;

		this.target.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
		this.target.position = new BABYLON.Vector3(0, 0, -5);
	}


	protected limitTarget(vector, distX, distY) {
	}


	public slowMo(prev: number, value: number, power: number = 50) {
		const cubicBezier = (x: number, p1, p2, p3, p4): number => {
			const xx = x * x;
			const nx = 1.0 - x;
			const nxnx = nx * nx;
			return nxnx*nx*p1 + 3.0*nxnx*x*p2 + 3.0*nx*xx*p3 + xx*x*p4;
		};

		// power = 10 + cubicBezier(Math.abs(prev - value) * 10, 1, .01, .83, .67) * 200;

		return (power * prev + value) / (power + 1);
	}


	protected calculateMovement(modifier: number = 1) {
		super.calculateMovement(modifier);

		const playerAbs = (<any> this).getScene().playerAbs;
		const thisAbs = (<any> this).getAbsolutePosition();

		if (!playerAbs) {
			return;
		}

		const jMatrix = Entity.getTranslationMatrix(this).invert();
		const player = playerAbs.clone();
		player.z -= /*(<any> this).getScene().currentInput.speed*/ - this.speed - this.bulletSpeed;

		const dst = BABYLON.Vector3.DistanceSquared(playerAbs, thisAbs);

		if (dst < 20000) {
			this.firedCount++;

			if (this.firedCount > 10) {
				this.firedCount = 0;
				this.joystickPressed();
			}
		}

		if (dst < 500) {
			return;
		}

		this.joystick.position = BABYLON.Vector3.TransformCoordinates(player, jMatrix);

		/* if (Math.sin((<any> this).time * 10000) > 0) {
			if (!this.fired) {
				// this.fired = true;
				this.joystickPressed();
			}
		} else {
			this.fired = false;
		} */
	}


	public onRender(event, emitter) {
		super.onRender(event, emitter);
	}


}
