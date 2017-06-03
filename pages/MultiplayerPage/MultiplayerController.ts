import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractController} from "../AbstractController";


declare const JSWorks: JSWorksLib;

interface IInitContentMessage {
    leader: boolean;
    rival_login: string;
}

@JSWorks.Controller
export class MultiplayerController extends AbstractController {

    public isGame: boolean = true;


    public onCreate(): void {

    }


    public onNavigate(args: object):void {

        super.onNavigate(args);

        const socket: WebSocket = new WebSocket(JSWorks.config['backendSocket']);

        socket.onopen = (event: Event) => {
            console.log(event);

            console.log('Info: WebSocket connection opened.');
            console.log('Info: Waiting for another player...');
            try {
                let joinGameMessage = {
                    type : "api.mechanics.requests.JoinGame$Request",
                    content: "{}"
                };
                socket.send(JSON.stringify(joinGameMessage));
            } catch (ex) {
                socket.close(1001, "error: exeception occured during the initialization stage: " + ex);
            }
        };

        socket.onclose =  () => {
            console.log('Info: WebSocket closed.');
        };

        socket.onerror = (ev: Event) => {
            console.error(ev);
        };

        socket.onmessage =  (event) => {
            // let content : IInitContentMessage;
            let message = JSON.parse(event.data);

            if (message.type === "init-game") {
                const content: IInitContentMessage = JSON.parse(message.content);

                console.log('Info: GameSession starts');

                if (content.leader) {
                    socket.send(JSON.stringify({
                        type: 'api.mechanics.base.ClientSnap',
                        content: `{"state":"hello slave, ${content.rival_login}! from leader with love"}`
                    }));
                } else {
                    socket.send(JSON.stringify({
                        type: 'api.mechanics.base.ClientSnap',
                        content: `{"state":"hello leader, ${content.rival_login}! from slave with love"}`
                    }));
                }

                return;
            }

            if (message.type === "server-snap") {
                const content = JSON.parse(message.content);
                console.log("Server snap: ", content);
                return;
            }

        }
    }
}