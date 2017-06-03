import BABYLON from "../../../static/babylon";
import {RealmClass} from "../../Realm/Realm";
import {IObject} from "../../ObjectFactory/ObjectFactory";
import FastSimplexNoise from "../../../node_modules/fast-simplex-noise/src";
import {StarShip} from "../../Models/StarShip";
import {Random} from "../../Utils/Random";
import {OfflineMap} from "../OfflineMap";
import {Line3} from "../../Utils/Line3";
import {NPCStarShip} from "../../Models/NPCStarShip";
import {TrafficSection} from "./TrafficSection";


declare const Realm: RealmClass;


export class TrafficLine extends BABYLON.Mesh implements IObject {

    public sections: TrafficSection[] = [];
    public sectionCount: number;
    public vectors: Line3[] = [];
    public vectorStep: number = 10;
    public sectionProto = TrafficSection;
    public isArc: boolean;
    public sectionLength: number;
    public direction: number = 1;
    public shipsConnected: StarShip[] = [];
    public hasNPCs: boolean = true;
    public NPCsSpawnDirection: number = 1;

    protected rand1: Random;
    protected rand2: Random;
    protected v1: BABYLON.Vector2;
    protected v2: BABYLON.Vector2;
    protected noise: FastSimplexNoise;
    protected lastVector: BABYLON.Vector3;
    protected sectionsSinceLastVector: number = 0;

    private startArcAngle: number = -15 * Math.PI / 180;
    private arcAngleDelta: number;
    private lastArcAngle: number;
    private NPCDelayMax: number = 120;
    private NPCDelay: number = this.NPCDelayMax;
    private framesPassed: number = 0;


    constructor(name: string, scene: BABYLON.Scene, parent: OfflineMap, random: Random,
                isArc: boolean = false, sectionCount: number = 51, sectionLength: number = 5,
                setChildrenTrueParent: boolean = false,
    ) {
        super(name, scene, parent);

        this.rand1 = random;
        this.rand2 = new Random(this.rand1.number);
        this.v1 = this.rand1.Vector2.scale(10000);
        this.v2 = this.rand2.Vector2.scale(10000);
        this.noise = new FastSimplexNoise({random: () => random.number});
        this.isArc = isArc;
        this.sectionCount = sectionCount;
        this.arcAngleDelta = -this.startArcAngle / (0.5 * this.sectionCount);
        this.sectionLength = sectionLength;

        Realm.objects.addObject(`${name}__mapSection`, this.sectionCount, (): IObject => {
            let parent = this.parent;

            if (setChildrenTrueParent) {
                parent = this;
            }

            return new (this.sectionProto)(`${name}__mapSection`, scene, parent, 3, this.rand1);
        });
    }


    public onCreate(): void {
    }


    public getNPCName(): string {
        return (<OfflineMap> this.parent).NPCName;
    }


    protected pushSection(section: TrafficSection): void {
        if (this.sectionsSinceLastVector === 0) {
            this.lastVector = section.position;
        }

        this.sections.push(section);
        this.sectionsSinceLastVector++;

        if (this.sectionsSinceLastVector > this.vectorStep) {
            this.vectors.push(new Line3(this.lastVector, section.position));
            this.sectionsSinceLastVector = 0;
            section['_vectorStart'] = true;
        }
    }


    public onGrab(): void {
        (<OfflineMap> this.parent).getLeadingPlayerPos()
    }


    public reposition(): void {
        this.lastArcAngle = this.startArcAngle;

        let last: TrafficSection = <TrafficSection> Realm.objects.grab(`${this.name}__mapSection`);
        last.position = this.position;
        last.afterSection(last, this.nextVector());
        last['_index'] = 0;

        for (let i = 0; i < this.sectionCount - 1; i++) {
            const next: TrafficSection = <TrafficSection> Realm.objects.grab(`${this.name}__mapSection`);
            next.afterSection(last, this.nextVector());
            this.pushSection(next);
            next['_index'] = i + 1;

            last = next;
        }
    }


    public onFree(): void {
        Realm.objects.freeAll(`${this.name}__mapSection`);
        this.sections = [];
        this.vectors = [];

        this.shipsConnected.forEach((ship: StarShip) => {
            if (ship.isAI) {
                Realm.objects.free(this.getNPCName(), ship);
            }
        });

        this.shipsConnected = [];
    }


    public onDelete(): void {
        this.dispose(true);
        Realm.objects.removeObject(`${name}__mapSection`);
    }


    protected captureShip(ship: StarShip, section: TrafficSection, aim: BABYLON.Vector3): void {
        section = this.findSection(ship, 0, this.direction === 1 ? -1 : 1);
        const dist: number = BABYLON.Vector3.DistanceSquared(ship.position,
                section.position.add(new BABYLON.Vector3(0, 4, 0)));
        const speed: number = Realm.calculateLag(ship.speed, ship.maxSpeed * (7.5**2 / dist)**2 * 2, 100);

        if (ship.canMove) {
            ship.speed = speed;
        }

        if (ship.speed > ship.maxSpeed) {
            ship.speed = ship.maxSpeed;
        }

        if (ship.speed < 0) {
            ship.speed = 0;
        }

        if (ship.position.y < section.position.y + 3.5) {
            ship.speed = Realm.calculateLag(ship.speed, 0, 30);
            ship.aimYLimit = 5;

            if (ship.position.y < section.position.y + 0.5) {
                ship.aimYLimit = 10;
            }

            if (ship.position.y < section.position.y - 0.5) {
                ship.aimYLimit = 20;
            }
        } else {
            ship.aimYLimit = undefined;
        }

        if (ship.canMove && !ship.isAI && this.framesPassed > 60 && ship.position.y < section.position.y) {
            Realm.dieImmediately();
            return;
        }

        if (ship.canMove && ship.speed < ship.maxSpeed * 0.4) {
            Realm.flashDyingSoon();
        } else {
            Realm.doNotDie();
        }
    }



    public onRender(): void {
        this.framesPassed++;

        this.shipsConnected.forEach((ship: StarShip, index: number) => {
            const section: TrafficSection = this.findSection(ship);
            const aim: BABYLON.Vector3 = section.position.add(new BABYLON.Vector3(0, 5, 0));

            if (!ship.isAI) {
                this.captureShip(ship, section, aim);
                ship.setImmediateAim(aim);

                return;
            } else {
                ship.setImmediateAim(aim);
            }

            if (ship.position.x - 10 > (<any> this.parent).getLeadingPlayer().position.x) {
                Realm.objects.free(this.getNPCName(), ship);
                this.shipsConnected.splice(index, 1);
            }

            /*if ((this.direction == 1 && (section['_index'] + 5) > this.sections.length)
                    || (this.direction == -1 && section['_index'] < 5)) {
                Realm.objects.free(this.getNPCName(), ship);
                this.shipsConnected.splice(index, 1);
            }*/
        });
        
        this.NPCDelay--;

        if (this.NPCDelay > 0) {
            return;
        }

        this.NPCDelay = this.NPCDelayMax;

        if (!this.hasNPCs || this.rand1.number > 0.4 || !Realm.objects.hasFree(this.getNPCName())) {
            return;
        }

        const npc: NPCStarShip = <NPCStarShip> Realm.objects.grab(this.getNPCName());
        npc.speed = npc.maxSpeed;


        if (this.NPCsSpawnDirection === 1) {
            if (this.direction === 1) {
                npc.position = this.sections[0].position.clone();
                npc.setImmediateAim(this.sections[3].position.subtract(this.position));
            } else  {
                npc.position = this.sections[this.sections.length - 2].position.clone();
                npc.setImmediateAim(this.sections[this.sections.length - 5].position.subtract(this.position));
            }
        } else {
            // Always looks ahead

            npc.position = this.sections[this.sections.length - 5].position.clone();
            npc.setImmediateAim(this.sections[this.sections.length - 2].position.subtract(this.position));
        }

        this.connectShip(npc);
    }


    protected nextVector(): BABYLON.Vector3 {
        if (this.isArc) {
            const result: BABYLON.Vector3 = new BABYLON.Vector3(
                0,
                0.5 * Math.PI,
                this.lastArcAngle,
            );

            this.lastArcAngle += this.arcAngleDelta;
            return result;
        }

        let value1: number = this.noise.scaled([this.v1.x, this.v1.y]);
        let value2: number = this.noise.scaled([this.v2.x, this.v2.y]);

        const step: number = 0.005;
        this.v1.addInPlace(new BABYLON.Vector2(step, step));
        this.v2.addInPlace(new BABYLON.Vector2(step, step));

        return new BABYLON.Vector3(
            this.rotation.x,
            this.rotation.y + value1 * 0.6,
            this.rotation.z + value2 * 0.6,
        );
    }


    protected nextSectionIndex(last: number): number {
        const next: number = last + this.direction;

        if (next < 0) {
            return this.sections.length - 1;
        }

        if (next > this.sections.length - 1) {
            return 0;
        }

        return next;
    }


    protected nextNearestSectionIndex(last: number, position: BABYLON.Vector3): number {
        const next: number = this.nextSectionIndex(last);

        if (BABYLON.Vector3.DistanceSquared(
                this.sections[next].position,
                position,
            ) > BABYLON.Vector3.DistanceSquared(
                this.sections[last].position,
                position,
            )) {
            return undefined;
        }

        return next;
    }


    public connectShip(ship: StarShip): void {
        this.shipsConnected.push(ship);
    }


    private findSection(ship: StarShip, offset: number = 3, direction: number = this.direction): TrafficSection {
        let current: number = ship['_lastSectionIndex'] || direction === 1 ? 0 : this.sections.length - 1;
        let last: number;

        for (; current !== undefined && current !== last; current =
                    this.nextNearestSectionIndex(current, ship.position)) {
            last = current;
        }

        if (direction === this.direction) {
            ship['_lastSectionIndex'] = last;
        }

        return this.sections[this.nextSectionIndex(last + offset * direction)];
    }

}
