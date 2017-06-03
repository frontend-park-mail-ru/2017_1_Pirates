import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {ITableColumn} from "./ITable";
import {TableController} from "./TableController";


declare const JSWorks: JSWorksLib;


@JSWorks.Component({ view: 'TableView', controller: 'TableController' })
export class TableComponent {

    public controller: TableController;


    @(<any> JSWorks.ComponentProperty())
    public title: string = 'Table';


    @(<any> JSWorks.ComponentProperty())
    public selectable: boolean = true;


    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;

    @(<any> JSWorks.ComponentProperty())
    public error: string;


    @(<any> JSWorks.ComponentProperty())
    public selectedRow: number;


    /* public toolbox: boolean = true;

    public paginator: boolean = true; */


    public offset: number = 0;
    public limit: number = 20;
    public total: number = 1483;


    public isEditing: boolean = false;

    private _toolbox: boolean = true;
    private _paginator: boolean = true;

    public get toolbox(): boolean {
        return this._toolbox;
    }

    public set toolbox(value: boolean) {
        (<any> this).view.DOMRoot.querySelector('.table-toolbox').toggleClass('hidden', !value);
        this._toolbox = value;
    }

    public get paginator(): boolean {
        return this._paginator;
    }

    public set paginator(value: boolean) {
        (<any> this).view.DOMRoot.querySelector('.table-pager').toggleClass('hidden', !value);
        this._paginator = value;
    }


    public onCellClick: (table: TableComponent, row: number, column: number, data: any) => void;


    @(<any> JSWorks.ComponentCollectionProperty())
    public columns: ITableColumn[] = [];


    @(<any> JSWorks.ComponentCollectionProperty())
    public data: any[] = [];

}