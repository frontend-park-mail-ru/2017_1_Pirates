

export interface INewable {
    new (...args: any[]): INewable;

    render?(): void;
}
