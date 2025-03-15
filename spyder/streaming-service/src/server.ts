import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number | string;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  let batteryWarning = 0;

  socket.on("data", (msg) => {
    const message: string = msg.toString();
    
    // Send JSON over WS to frontend clients
    websocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        let tempData = JSON.parse(message);
        let temp = tempData.battery_temperature;

        console.log(`Recieved: ${message}`)

        if(!isNaN(temp)){
          client.send(message);
          
          //temporary temperatures to test limits and warnings
          if(temp < 20 || temp > 40){
            batteryWarning++;
          }
          else{
            batteryWarning--;
          }

          if(batteryWarning > 3){
            console.log(`Warning! Battery temperature is ${temp} @ timestamp: ${tempData.timestamp}`);
            batteryWarning--;
          }
        }
        else{
          //just logging it for now, will implement a better solution later
          console.log(`Received invalid temperature!`);
        }

      }
    });
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
