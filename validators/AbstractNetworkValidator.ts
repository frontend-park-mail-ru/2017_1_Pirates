import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {JSONParserService} from "jsworks/dist/dts/Parser/JSON/JSONParserService";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


export abstract class AbstractNetworkValidator {

    public abstract relUrl: string;


    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const jsonParser: JSONParserService = JSWorks.applicationContext.serviceHolder
                .getServiceByName('JSONParser');
            const page: any = JSWorks.applicationContext.currentPage;
            page.loading = true;

            jsonParser.parseURLAsync(JSWorks.config['backendURL'] + this.relUrl,
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ value: args['value'] }),
                { 'Content-Type': 'application/json' },
            ).then((result) => {
                page.loading = false;

                if (!(result instanceof Array)) {
                    result = [result];
                }

                if ((<any[]> result).some((entry): boolean => {
                    if (typeof entry !== 'object') {
                        return true;
                    }

                    return entry['status'] === 'error';
                })) {
                    reject((<any[]> result).map((entry) => {
                        return entry['msg'];
                    }));

                    return;
                }

                resolve();
            }).catch((err) => {
                page.loading = false;
                reject((err || {}).message || String(err));
            });
        });
    }
}
