import BABYLON from "../../static/babylon";
import {RealmClass} from "../Realm/Realm";
import {IObject} from "../ObjectFactory/ObjectFactory";
import {OfflineGameState} from "../States/OfflineGameState";
import {Random} from "../Utils/Random";
import {TrafficLine} from "./Traffic/TrafficLine";
import {MainTrafficLine} from "./Traffic/MainTrafficLine";
import {StarShip} from "../Models/StarShip";
import {NPCStarShip} from "../Models/NPCStarShip";
import {Building} from "./Building";
import {Bullet} from "../Models/Bullet";
import {PoliceStarShip} from "../Models/PoliceStarShip";


declare const Realm: RealmClass;


export class OfflineMap extends BABYLON.Mesh implements IObject {

    public random: Random;
    public trafficLines: TrafficLine[] = [];
    public trafficLineCount: number = 4;
    public mainTrafficLine: MainTrafficLine;
    public NPCName: string;
    public buildingName: string;
    public policeShips: PoliceStarShip[] = [];
    public started: boolean = false;


    constructor(name: string, scene: BABYLON.Scene, parent: OfflineGameState, random: Random) {
        super(name, scene, parent);
        this.random = random;
        this.NPCName = `${name}_NPC`;
        this.buildingName = `${name}__building`;
    }


    public onCreate(): void {
    }

    public onDelete(): void {
        this.dispose(true);
    }


    public spawnPoliceShip(): void {
        if (!Realm.objects.hasFree('policeStarShip')) {
            return;
        }

        const ship: PoliceStarShip = <PoliceStarShip> Realm.objects.grab('policeStarShip');
        ship.position = this.mainTrafficLine.getLastSection().position.clone();
        ship.position.y += 50;
        ship.speed = ship.maxSpeed;

        const doRender = ship.onRender;
        let shootInterval: number = 0;

        ship.onRender = () => {
            ship.setImmediateAim(ship.position.subtract(this.getLeadingPlayer().position));
            //ship.aim = this.getLeadingPlayer().position.add(new BABYLON.Vector3(-5, 0, 0));
            shootInterval++;

            if (shootInterval > 300) {
                shootInterval = 0;
                ship.shoot();
            }

            if (ship.position.x - 10 > this.getLeadingPlayer().position.x) {
                this.deletePoliceShip(ship);
            }

            doRender.call(ship);
        };

        this.policeShips.push(ship);
    }


    public deletePoliceShip(ship: PoliceStarShip): void {
        Realm.objects.free('policeStarShip', ship);
        this.policeShips.splice(this.policeShips.indexOf(ship), 1);
    }


    public grabResources(seed: number): void {
        this.random = new Random(seed);
        let i = 0;

        Realm.objects.addObject(`${this.name}_trafficLine`, this.trafficLineCount, (): IObject => {
            return new TrafficLine(`${this.name}_${i++}_trafficLine`, this.getScene(), this, this.random, true,
                undefined, 3);
        });

        Realm.objects.addObject(`${this.name}_mainTrafficLine`, 1, (): IObject => {
            return new MainTrafficLine(`${this.name}_mainTrafficLine`, this.getScene(), this, this.random);
        });

        Realm.objects.addObject(this.NPCName, 100, (): IObject => {
            return new NPCStarShip(this.NPCName, this.getScene());
        });

        Realm.objects.addObject('greenBullet', 50, (): IObject => {
            return Bullet.createBullet('greenBullet', this, true);
        });

        Realm.objects.addObject('redBullet', 200, (): IObject => {
            return Bullet.createBullet('redBullet', this, false);
        });

        Realm.objects.addObject('policeStarShip', 10, (): IObject => {
            return new PoliceStarShip('police', this.getScene());
        });


        const seedMapping: number[] = [];
        const buildingsBufferSize: number = 40;

        for (let i = 0; i < buildingsBufferSize; i++) {
            seedMapping.push(this.random.range(-1000000, 1000000));
        }

        Realm.objects.addObject(this.buildingName, buildingsBufferSize, (i: number): IObject => {
            const building: Building = new Building(seedMapping[i], this.buildingName, this.getScene(),
                    undefined);
            building.setEnabled(false);

            return building;
        });
    }


    public freeResources(): void {
        Realm.objects.removeObject(`${this.name}_trafficLine`);
        Realm.objects.removeObject(`${this.name}_mainTrafficLine`);
        Realm.objects.removeObject(this.NPCName);
        Realm.objects.removeObject('greenBullet');
        Realm.objects.removeObject('redBullet');
        Realm.objects.removeObject('policeStarShip');
        Realm.objects.removeObject(this.buildingName);
    }


    public startMap(): void {
        Realm.objects.notifyLoaded();
        this.started = true;
        this.mainTrafficLine = <MainTrafficLine> Realm.objects.grab(`${this.name}_mainTrafficLine`);

        for (let i = 0; i < this.trafficLineCount; i++) {
            const trafficLine: TrafficLine = <TrafficLine> Realm.objects.grab(`${this.name}_trafficLine`);

            this.placeTrafficLine(trafficLine, i);
            this.trafficLines.push(trafficLine);
        }

        for (let i = 0; i < this.mainTrafficLine.sectionCount * 2; i++) {
            this.mainTrafficLine.generateNextSection();
        }

        this.getLeadingPlayer().position = this.mainTrafficLine.sections[
                    this.mainTrafficLine.sectionCount - 20
            ].position.add(new BABYLON.Vector3(0, 4, 0));
        this.getLeadingPlayer().setImmediateAim(this.mainTrafficLine.sections[
                    this.mainTrafficLine.sectionCount - 17
            ].position.add(new BABYLON.Vector3(0, 4, 0)));
    }


    public onGrab(): void {
        this.setEnabled(true);
    }


    protected placeTrafficLine(line: TrafficLine, index: number, secondary: boolean = false): void {
        if (secondary && index < 2) {
            index += 2;
        }

        const xDistCf: number = (index > 1) ? 1 : 0.5;
        const length = this.mainTrafficLine.sections.length;
        const sectionIndex: number = Math.floor(xDistCf * length) - (index % 2) * 3 - 3;
        const position: BABYLON.Vector3 = this.mainTrafficLine.sections[sectionIndex].position;

        line.position = position.subtract(new BABYLON.Vector3(0, -80, 0.5 * 145.455));
        line.direction = index % 2 === 0 ? 1 : -1;
        line.reposition();

        for (let i = sectionIndex - 3; i < sectionIndex + 3; i++) {
            if (this.mainTrafficLine.sections[i]) {
                this.mainTrafficLine.sections[i].hasCrossingAttached = true;
            }
        }
    }


    public getLeadingPlayer(): StarShip {
        return (<OfflineGameState> this.parent).getLeadingPlayer();
    }


    public getLeadingPlayerPos(): BABYLON.Vector3 {
        return this.getLeadingPlayer().position;
    }


    public onFree(): void {
        this.started = false;

        Realm.objects.freeAll(this.NPCName);
        Realm.objects.freeAll(`${this.name}_mainTrafficLine`);
        Realm.objects.freeAll(`${this.name}_trafficLine`);
        this.trafficLines = [];

        this.freeResources();
        this.setEnabled(false);
    }


    public onRender(): void {
        if (!this.started) {
            return;
        }

        this.trafficLines.forEach((line: TrafficLine, index: number) => {
            if ((<OfflineGameState> this.parent).getLeadingPlayerPos().x - line.position.x < -10) {
                Realm.objects.free(`${this.name}_trafficLine`, line);

                this.trafficLines[index] = <TrafficLine> Realm.objects.grab(`${this.name}_trafficLine`);
                this.placeTrafficLine(this.trafficLines[index], index, true);
            }
        });

        if ((<OfflineGameState> this.parent).getLeadingPlayerPos().x -
                    this.mainTrafficLine.sections[0].position.x < -40) {
            this.mainTrafficLine.generateNextSection();
        }

        /*if (this.random.number < 0.01) {
            this.spawnPoliceShip();
        }*/
    }


    public getBuildingName(): string {
        return this.buildingName;
    }

}
