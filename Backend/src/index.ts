import { parseJsonSourceFileConfigFileContent } from "typescript";
import { WebSocketServer,WebSocket } from "ws";

interface UserSocket{
    socket: WebSocket;
    room: String;
}


const wss = new WebSocketServer({port:8080});
const allSocket:UserSocket[] = []



wss.on("connection",function(socket){


    socket.on("message",(message)=>{
        //@ts-ignore
        const parsedMessage = JSON.parse(message)

        if(parsedMessage.type == "join"){
            console.log("user want to join room "+ parsedMessage.payload.roomId);
            allSocket.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type == "chat"){
            console.log("user wants to send message" + " " +parsedMessage.payload.message);
            let currentRoomUser = null
            
            for(let i = 0;i<allSocket.length;i++){
                if(allSocket[i].socket == socket){
                    currentRoomUser = allSocket[i].room
                }
            }
            for(let i=0;i<allSocket.length;i++){
                if(allSocket[i].room == currentRoomUser){
                    allSocket[i].socket.send(parsedMessage.payload.message)
            }
        }
    }
})

})