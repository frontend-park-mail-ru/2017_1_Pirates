import {INewable} from "../common/INewable";
import {MotionScene} from "../scenes/scene";
import {Chunk} from "./chunk";
import {EventType} from "../common/EventType";

declare const BABYLON;
declare const JSWorks;

export class Map extends (<INewable> BABYLON.Mesh) {

    private chunks: Chunk[];
    private scene: MotionScene;
    private counter: number = 0;
    private _potentialArea: { side: number, front: number, };
    public chunkSize: { width: number, height: number, } = {width: 1000, height: 1000,};
    private _activeChunk: Chunk;
    private visibleArea: { leftDown: { x: number, z: number }, rightTop: { x: number, z: number } };

    constructor(name: string, scene: MotionScene) {
        super(name, scene);
        this.scene = scene;

        this.loadChunks();
        this._potentialArea = {side: 1000, front: 1000,};

        JSWorks.EventManager.subscribe(this, this.scene, EventType.MAP_ENDS,
            (event, emitter) => {

                // провеяем какие блоки сейчас активны(попадают в прямоугольник видимости)
                this.chunks.forEach(chunk => {
                    if (!chunk.isSeeable(event.data.visibleArea)) {
                        chunk.isActive = false;
                    }
                });

                this.arrangeChunks(event.data.visibleArea, false);

                // определяем текущий активный блок (этот параметр использует сцена, для того чтобы запускать событие
                // MAP_ENDS
                const pos = event.data.shipPosition;
                this.chunks.forEach(chunk => {
                    if (chunk.inArea(pos)) {
                        this.activeChunk = chunk;
                        return;
                    }
                });

            }
        )
    }

    public getScene(): MotionScene {
        return this.scene;
    }

    /**
     * загрузить блоки
     */
    public loadChunks(): void {
        this.chunks = [
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("green", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("blue", this.scene, this.chunkSize.width, this.chunkSize.height),
            new Chunk("red", this.scene, this.chunkSize.width, this.chunkSize.height),
        ];
    }

    /**
     * проход по прямоугольной бласти и рендеринг блоков в ней
     * @param visibleArea область, в которой необходимо иметь блоки
     * @param start флаг, помечающий то, что это начальная инициализация
     */
    public arrangeChunks(visibleArea: { leftDown: { x: number, z: number }, rightTop: { x: number, z: number } },
                         start: boolean): void {

        for (let z = Math.round(visibleArea.rightTop.z / this.chunkSize.height) * this.chunkSize.height;
             z >= visibleArea.leftDown.z; z -= this.chunkSize.height) {

            for (let x = Math.round(visibleArea.leftDown.x / this.chunkSize.width) * this.chunkSize.width;
                 x <= visibleArea.rightTop.x; x += this.chunkSize.width) {
                const currentChunkPos = {x: x, z: z};

                // проверка рендерили мы уже область или нет, если да переходим к следующуей итерации
                if (!start && this.isRendered(currentChunkPos)) {
                    // console.log("eee");
                    continue;
                }

                // ищем не активный блок
                for (let i = 0; i < this.chunks.length && this.chunks[this.counter].isActive; i++) {
                    this.counter = (this.counter + 1) % this.chunks.length;
                }

                // ставим его в currentChunkPos
                this.chunks[this.counter].init(currentChunkPos);
                this.counter = (this.counter + 1) % this.chunks.length;
            }

        }
        // обновляем область видимости
        this.visibleArea = visibleArea;
    }

    /**
     * инициализация стартовых блоков
     */
    public initStartChunks() {
        this.visibleArea = {
            leftDown: {x: 0, z: 0},
            rightTop: {x: 0, z: 0}
        };

        this.arrangeChunks({
            leftDown: {x: -this._potentialArea.side / 2, z: 0},
            rightTop: {x: this._potentialArea.side / 2, z: this._potentialArea.front}
        }, true);

        this.chunks.forEach(chunk => {
            if (chunk.inArea(new BABYLON.Vector3(0, 0, 1))) {
                this._activeChunk = chunk;
                console.log(this._activeChunk);
                return;
            }
        });

    }

    get potentialArea(): { side: number; front: number } {
        return this._potentialArea;
    }

    set potentialArea(value: { side: number; front: number }) {
        this._potentialArea = value;
    }

    get activeChunk(): Chunk {
        return this._activeChunk;
    }

    set activeChunk(value: Chunk) {
        this._activeChunk = value;
    }

    /**
     * проверка на то, рендерилась текущая точка(т.е. находится ли она в текущей зоне видимости)
     * @param pos координаты точки
     * @returns {boolean} true если находится
     */
    public isRendered(pos: { x: number, z: number }): boolean {
        return (this.visibleArea.leftDown.z < pos.z) && (this.visibleArea.leftDown.x < pos.x)
            && (this.visibleArea.rightTop.z > pos.z) && (this.visibleArea.rightTop.x > pos.x);
    }
}
