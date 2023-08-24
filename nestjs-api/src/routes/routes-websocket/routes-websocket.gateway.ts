import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesWebsocketGateway {
  @SubscribeMessage('new-points')
  handleMessage(client: Socket, payload: SocketPayload) {
    client.broadcast.emit('admin-new-points', payload);
    // client.broadcast.emit(`new-point/${payload.route_id}`, payload);
  }
}

type SocketPayload = {
  route_id: string;
  lat: number;
  lng: number;
};
