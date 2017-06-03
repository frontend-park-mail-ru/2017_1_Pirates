import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {SimpleVirtualDOM} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOM";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {TableComponent} from "./TableComponent";
import {ITableColumn} from "./ITable";
import {WindowComponent} from "../WindowComponent/WindowComponent";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class TableController {

    public view: View;
    public component: TableComponent;

    public onCellChange: (table: TableComponent, data: object) => void;
    public onAdd: (table: TableComponent) => void;
    public onRemove: (table: TableComponent, data: object) => void;
    public onQuery: (table: TableComponent) => void;


    public triggerRefresh(): any[] {
        this.component.selectedRow = undefined;
        const values = (<any> this.component.columns).getValues();
        (<any> this.component.columns).clear();

        return values;
    }


    public onDOMInsert(): void {
        this.refresh();

        if (!this.component.toolbox) {
            return;
        }

        let button: SimpleVirtualDOMElement;

        button = this.view.DOMRoot.querySelector('.table-drop-filters-button');
        if (button) {
            button.addEventListener('click', (event) => {
                this.clearFilterButtonState();

                const values = this.triggerRefresh();

                (<any> this.component.columns).setValues(values.map((column: ITableColumn) => {
                    const returning: ITableColumn = {name: '', title: ''};

                    Object.keys(column).forEach((keyName: string) => {
                        returning[keyName] = column[keyName];
                    });

                    returning.filter = undefined;
                    returning.order = undefined;
                    return returning;
                }));
            });
        }


        button = this.view.DOMRoot.querySelector('.table-add-button');
        if (button) {
            button.addEventListener('click', () => {
                if (this.onAdd) {
                    this.onAdd(this.component);
                }
            });
        }


        button = this.view.DOMRoot.querySelector('.table-refresh-button');
        if (button) {
            button.addEventListener('click', () => {
                if (this.onQuery) {
                    this.onQuery(this.component);
                }

                this.refresh();
            });
        }

        window.setTimeout(() => {
            button = this.view.DOMRoot.querySelector('.table-remove-button');

            if (!button) {
                return;
            }

            this.view.DOMRoot.querySelector('.table-remove-button').addEventListener('click', () => {
                if (this.view.DOMRoot.querySelector('.table-remove-button').hasClass('table-inactive-button')) {
                    return;
                }

                const windows: WindowComponent = JSWorks.applicationContext.currentPage['view']
                    .DOMRoot.querySelector('#modal-root').component;
                const windowView: View = JSWorks.applicationContext.viewHolder.getView('DeleteDialogView');
                const yesButton = windowView.DOMRoot.querySelector('.dialog-yes');
                const noButton = windowView.DOMRoot.querySelector('.dialog-no');

                yesButton.removeEventListeners('click');
                yesButton.addEventListener('click', () => {
                    const data: object = (<any> this.component.data).get(this.component.selectedRow);

                    if (this.onRemove) {
                        this.onRemove(this.component, data);
                    }

                    windows.closeLastWindow();
                });

                noButton.removeEventListeners('click');
                noButton.addEventListener('click', () => {
                    windows.closeLastWindow();
                });

                windows.openWindow(windowView);
            });
        }, 100);
    }


    public refresh(): void {
        const paginator: SimpleVirtualDOMElement = this.view.DOMRoot.querySelector('.table-pager-text');

        if (paginator) {
            if (this.component.total === 0) {
                paginator.children.item(0).text = `Нет записей`;
            } else {
                paginator.children.item(0).text = `Показаны записи с ${this.component.offset + 1} по ${
                    ((this.component.offset + this.component.limit) > this.component.total) ?
                        this.component.total : (this.component.offset + this.component.limit)}
                        из ${this.component.total}`;
            }
        }

        const values = this.triggerRefresh();
        (<any> this.component.columns).setValues(values);
    }


    private patchSorter(column: SimpleVirtualDOMElement, colData: ITableColumn): void {
        const sorter: SimpleVirtualDOMElement = column.querySelector('.table-column-sorter');

        if (!sorter || sorter['_tablePatched']) {
            return;
        }

        sorter.addEventListener('click', (event) => {
            event.stopPropagation();

            switch (colData.order) {

                case 'asc': {
                    colData.order = 'desc';
                } break;

                case 'desc': {
                    colData.order = undefined;
                } break;

                case undefined: {
                    colData.order = 'asc';
                }

            }

            if (this.onQuery) {
                this.onQuery(this.component);
            }

            this.refresh();
        });

        sorter['_tablePatched'] = true;
    }


    private clearFilterButtonState(): void {
        const button = this.view.DOMRoot.querySelector('.table-filter button');

        button.removeEventListeners('click');
        button.parentNode.removeEventListeners('click');
        button.parentNode['_tablePatched'] = undefined;
    }


    private patchFilter(column: SimpleVirtualDOMElement, colData: ITableColumn): void {
        const filter: SimpleVirtualDOMElement = column.querySelector('.table-column-filter');

        if (!filter || filter['_tablePatched']) {
            return;
        }

        filter.addEventListener('click', (event) => {
            event.stopPropagation();

            const input: SimpleVirtualDOMElement = this.view.DOMRoot.querySelector('.table-filter');
            const boundingRect = (<any> filter.rendered).getBoundingClientRect();

            input.setStyleAttribute('left', Math.floor(boundingRect.left) + 'px');
            input.setStyleAttribute('top', Math.floor(boundingRect.top) + 'px');
            input.setStyleAttribute('display', 'inline-block');
            (<any> input.rendered).value = colData.filter || '';

            const button = this.view.DOMRoot.querySelector('.table-filter button');

            if (!document.body['_tablePatched']) {
                document.body.addEventListener('click', () => {
                    input.setStyleAttribute('display', 'none');
                });

                document.body['_tablePatched'] = true;
            }

            if (!button.parentNode['_tablePatched']) {
                const dummyClickListener = (event) => {
                    event.stopPropagation();
                };

                const buttonClickListener = () => {
                    input.setStyleAttribute('display', 'none');

                    const value: string = (<any> input.querySelector('input').rendered).value;
                    const oldFilter: string = colData.filter;

                    if ((value || '').length > 0) {
                        colData.filter = value;
                    } else {
                        colData.filter = undefined;
                    }

                    if (oldFilter === colData.filter) {
                        return;
                    }

                    this.clearFilterButtonState();

                    if (this.onQuery) {
                        this.onQuery(this.component);
                    }

                    this.refresh();
                };

                button.addEventListener('click', buttonClickListener);
                button.parentNode.addEventListener('click', dummyClickListener);
                button.parentNode['_tablePatched'] = true;
            }
        });

        filter['_tablePatched'] = true;
    }


    private patchCells(): void {
        this.view.DOMRoot.querySelectorAll('.table-cell').forEach((cell: SimpleVirtualDOMElement) => {
            const columnIndex: number = parseInt(cell.getAttribute('column'), 10);
            const column: ITableColumn = (<any> this.component.columns).get(columnIndex);
            const href = cell.querySelector('a');

            if (href) {
                href.removeEventListeners('click');
                href.addEventListener('click', (event) => {
                    event.preventDefault();

                    const propName: string = column.foreignKey.valueKey || column.name;

                    if (typeof column.foreignKey.route === 'string') {
                        column.foreignKey.route = JSWorks.applicationContext.routeHolder.getRoute(
                                column.foreignKey.route);
                    }

                    column.foreignKey.route.fire({[propName]: (<any> this.component.data)
                        .get(parseInt(cell.getAttribute('row'), 10))[propName]});
                });
            }

            cell.toggleClass('cursor-pointer', this.component.onCellClick !== undefined);

            cell.removeEventListeners('click');
            cell.addEventListener('click', (event) => {
                if (this.component.onCellClick) {
                    this.component.onCellClick(
                        this.component,
                        parseInt(cell.getAttribute('row'), 10),
                        parseInt(cell.getAttribute('column'), 10),
                        (<any> this.component.data).get(parseInt(cell.getAttribute('row'), 10)),
                    );
                }

                if (!this.component.selectable || this.component.isEditing) {
                    return;
                }

                this.view.DOMRoot.querySelectorAll('.table-cell').forEach((anyCell) => {
                    anyCell.toggleClass('table-cell-selected', false);
                });

                const row: number = parseInt(cell.getAttribute('row'), 10);
                this.component.selectedRow = row;

                this.view.DOMRoot.querySelectorAll(
                    `.table-cell[row="${row}"]`).forEach((rowCell) => {
                    if (rowCell.hasClass('table-cell-title')) {
                        return;
                    }

                    rowCell.toggleClass('table-cell-selected', true);
                });

                cell.rendered.dispatchEvent(new Event('mouseover'));
            });

            cell.removeEventListeners('mouseover');
            cell.addEventListener('mouseover', () => {
                if (this.component.isEditing) {
                    return;
                }

                const highlightCell = (cell: SimpleVirtualDOMElement) => {
                    if (cell.hasClass('table-cell-title') || cell.hasClass('table-cell-selected')) {
                        return;
                    }

                    cell.toggleClass('table-cell', true);
                    cell.toggleClass('table-cell-hover', true);
                };

                this.view.DOMRoot.querySelectorAll('.table-cell').forEach((anyCell) => {
                    if (
                        anyCell.getAttribute('row') === cell.getAttribute('row') ||
                        anyCell.getAttribute('column') === cell.getAttribute('column')
                    ) {
                        highlightCell(anyCell);
                        return;
                    }

                    anyCell.toggleClass('table-cell-hover', false);
                });
            });
        });
    }


    private setupInput(column: ITableColumn, cell: SimpleVirtualDOMElement, text: string): SimpleVirtualDOMElement {
        const input: SimpleVirtualDOMElement = JSWorks.applicationContext.serviceHolder.
                getServiceByName('SimpleVirtualDOM').createElement('INPUT');
        input.setAttribute('value', text);

        input.addEventListener('blur', () => {
            this.component.isEditing = false;

            const data = (<any> this.component.data).get(parseInt(cell.getAttribute('row'), 10));
            data[column.name] = (<any> input.rendered).value;
            this.refresh();

            if (this.onCellChange) {
                this.onCellChange(this.component, data);
            }
        });

        window.setTimeout(() => {
            (<any> input.rendered).focus();
        }, 10);

        return input;
    }


    private setupSelect(column: ITableColumn, cell: SimpleVirtualDOMElement, text: string): SimpleVirtualDOMElement {
        const virtualDOM: SimpleVirtualDOM = JSWorks.applicationContext.serviceHolder.
                getServiceByName('SimpleVirtualDOM');
        const select: SimpleVirtualDOMElement = virtualDOM.createElement('SELECT');

        (column.selectList || []).forEach((optionText: string) => {
            const option: SimpleVirtualDOMElement = virtualDOM.createElement('OPTION');
            option.appendChild(virtualDOM.createTextElement(optionText));

            if (optionText === text) {
                option.setAttribute('selected', 'selected');
            }

            const onBlur = () => {
                this.component.isEditing = false;

                const data = (<any> this.component.data).get(parseInt(cell.getAttribute('row'), 10));
                data[column.name] = (<any> select.rendered).value;
                this.refresh();

                if (this.onCellChange) {
                    this.onCellChange(this.component, data);
                }
            };

            select.addEventListener('blur', onBlur);
            select.addEventListener('change', onBlur);

            window.setTimeout(() => {
                (<any> select.rendered).focus();
            }, 10);

            select.appendChild(option);
        });

        return select;
    }


    private patchCellEvents(): void {
        this.view.DOMRoot.querySelectorAll('.table-cell').forEach((cell: SimpleVirtualDOMElement) => {
            if (cell['_tablePatched']) {
                return;
            }

            const columnIndex: number = parseInt(cell.getAttribute('column'), 10);
            const column: ITableColumn = (<any> this.component.columns).get(columnIndex);

            if (column.type === 'button') {
                const button: SimpleVirtualDOMElement = cell.querySelector('button');

                button.removeEventListeners('click');
                button.addEventListener('click', () => {
                    if (column.onButtonClick) {
                        column.onButtonClick(this.component, (<any> this.component.data).get(
                            parseInt(cell.getAttribute('row'), 10)));
                    }
                });
            }

            if (column.canEdit) {
                cell.addEventListener('dblclick', () => {
                    this.component.isEditing = true;

                    const text: string = (<any> this.component.data).get(
                            parseInt(cell.getAttribute('row'), 10))[column.name];
                    const viewEval: SimpleVirtualDOMElement = cell.querySelector('view-eval');

                    if (!viewEval) {
                        return;
                    }

                    viewEval.removeChildren();

                    switch (column.type) {
                        case 'select': {
                            viewEval.appendChild(this.setupSelect(column, cell, text));
                        } break;

                        default: {
                            viewEval.appendChild(this.setupInput(column, cell, text));
                        } break;
                    }
                });
            }

            cell['_tablePatched'] = true;
        });
    }


    private patchColumnWidths(): void {
        const items: SimpleVirtualDOMElement[] = this.view.DOMRoot.querySelectorAll('.table > view-for > view-item');
        let width: number = 0;
        let undefinedWidths: number = 0;

        (<any> this.component.columns).getValues().forEach((col: ITableColumn) => {
            if (col.width) {
                width += col.width;
            } else {
                undefinedWidths++;
            }
        });

        items.forEach((item: SimpleVirtualDOMElement, index: number) => {
            const col: ITableColumn = (<any> this.component.columns).get(index);

            if (!col) {
                return;
            }

            let grow = col.width;

            if (!grow) {
                grow = (1.0 - width) / undefinedWidths;
            }

            item.setStyleAttribute('flex-grow', String(grow * 100).replace(',', '.'));
        });
    }


    private patchPager(): void {
        const pager: SimpleVirtualDOMElement = this.view.DOMRoot.querySelector('.table-pager');

        if (!pager || pager['_tablePatched']) {
            return;
        }

        const query = () => {
            if (this.onQuery) {
                this.onQuery(this.component);
            }

            this.refresh();
        };

        pager.querySelector('.table-pager-start').addEventListener('click', () => {
            if (this.component.offset === 0) {
                return;
            }

            this.component.offset = 0;
            query();
        });

        pager.querySelector('.table-pager-back').addEventListener('click', () => {
            if (this.component.offset - this.component.limit < 0) {
                return;
            }

            this.component.offset -= this.component.limit;
            query();
        });

        pager.querySelector('.table-pager-forward').addEventListener('click', () => {
            if (this.component.offset + this.component.limit >= this.component.total) {
                return;
            }

            this.component.offset += this.component.limit;
            query();
        });

        pager.querySelector('.table-pager-end').addEventListener('click', () => {
            const newVal = Math.floor(this.component.total / this.component.limit) * this.component.limit;

            if (this.component.offset === newVal) {
                return;
            }

            this.component.offset = newVal;
            query();
        });

        pager['_tablePatched'] = true;
    }


    public onUpdate(): void {
        this.view.DOMRoot.querySelectorAll('.table-column').forEach((column: SimpleVirtualDOMElement) => {
            const colData: ITableColumn = (<any> this.component.columns).get(parseInt(column.getAttribute('column')));

            this.patchSorter(column, colData);
            this.patchFilter(column, colData);
        });

        this.patchCells();
        this.patchCellEvents();
        this.patchColumnWidths();
        this.patchPager();
    }

}
