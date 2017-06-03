

export class GUIFlashingAnimation {


    public static Visibility(element: any, count: number, duration: number)
                : Promise<any> {
        const toggleVisible = (value: boolean) => {
            if (element['getOuterHTML']) {
                element.toggleClass('hidden', !value);
                return;
            }

            element.classList.toggle('hidden', !value);
        };

        count *= 2;
        let flashed: number = -1;
        let lastVisible: boolean = true;
        const flashDuration: number = duration / count;

        return new Promise<any>((resolve) => {
            const handle: number = window.setInterval(() => {
                if (flashed >= count) {
                    window.clearInterval(handle);
                    toggleVisible(true);

                    resolve();
                    return;
                }

                lastVisible = !lastVisible;
                toggleVisible(lastVisible);
                flashed++;
            }, flashDuration);
        });
    }


}
