import BABYLON from "../../../static/babylon";
import {RealmClass} from "../../Realm/Realm";
import {IObject} from "../../ObjectFactory/ObjectFactory";
import {TrafficLine} from "./TrafficLine";
import {Random} from "../../Utils/Random";
import {OfflineMap} from "../OfflineMap";
import {TrafficSection} from "./TrafficSection";
import {MainTrafficSection} from "./MainTrafficSection";


declare const Realm: RealmClass;


export class MainTrafficLine extends TrafficLine implements IObject{

    public sections: MainTrafficSection[] = [];
    public sectionProto = MainTrafficSection;

    private sinceGenerated: number = 0;
    private segmentForBuilding: MainTrafficSection;
    private sinceSegmentSet: number = 0;


    constructor(name: string, scene: BABYLON.Scene, parent: OfflineMap, random: Random) {
        super(name, scene, parent, random, false, 91, 4, false); //121
        this.hasNPCs = true;
        this.NPCsSpawnDirection = -1;
    }


    public onRender(): void {
        super.onRender();

        if (!this.segmentForBuilding) {
            return;
        }

        this.sinceSegmentSet++;

        if (this.sinceSegmentSet > 10) {
            this.segmentForBuilding.generateBuildings();
            this.segmentForBuilding = undefined;
            this.sinceSegmentSet = 0;
        }
    }

    public onGrab(): void {
        this.reposition();
    }


    public generateNextSection(): void {
        Realm.objects.free(`${this.name}__mapSection`, this.sections[0]);

        const next: TrafficSection = <TrafficSection> Realm.objects.grab(`${this.name}__mapSection`);
        next.afterSection(this.sections[this.sections.length - 1], this.nextVector());

        if (this.sections.splice(0, 1)[0]['_vectorStart']) {
            this.vectors.splice(0, 1);
        }

        this.pushSection(next);
        this.sinceGenerated++;

        if (this.sinceGenerated < 20) {
            return
        }

        this.sinceGenerated = 0;
        this.sinceSegmentSet = 0;
        this.segmentForBuilding = <MainTrafficSection> next;
    }


    public getLastSection(): MainTrafficSection {
        return this.sections[this.sections.length - 1];
    }


    public getBuildingName(): string {
        return (<any> this.parent).getBuildingName();
    }

}
