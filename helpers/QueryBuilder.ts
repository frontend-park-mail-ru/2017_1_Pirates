import {TableComponent} from "../components/TableComponent/TableComponent";
import {ITableColumn} from "../components/TableComponent/ITable";


export interface IQuery {
    limit: number;
    offset: number;
    orders: string[][];
    filters: string[][];
}


export class QueryBuilder {

    static build(table: TableComponent): IQuery {
        const orders: string[][] = [];
        const filters: string[][] = [];

        (<any> table.columns).getValues().forEach((column: ITableColumn) => {
            if (column.order !== undefined) {
                orders.push([ column.name, column.order.toUpperCase() ]);
            }

            if (column.filter !== undefined) {
                filters.push([ column.name, column.filter ]);
            }
        });

        return {
            limit: table.limit,
            offset: table.offset,
            orders: orders,
            filters: filters,
        };
    }

}
