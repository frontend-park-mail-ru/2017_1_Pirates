import BABYLON from "../../static/babylon";


export class LoadingScreen implements BABYLON.ILoadingScreen {

    public loadingUIBackgroundColor: string = 'rgb(0, 0, 0)';


    constructor(public loadingUIText: string) {
    }


    public displayLoadingUI() {
    }

    public hideLoadingUI() {
    }

}