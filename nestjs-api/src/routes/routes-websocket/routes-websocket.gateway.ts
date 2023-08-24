import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesWebsocketGateway {
  constructor(
    @InjectQueue('new-points') private readonly newPointsQueue: Queue,
  ) {}

  @SubscribeMessage('new-points')
  async handleMessage(client: Socket, payload: SocketPayload) {
    client.broadcast.emit('admin-new-points', payload);
    // client.broadcast.emit(`new-point/${payload.route_id}`, payload);

    // Because the Redis queue is more fast than the mongo.db sending the data to the queue and processing this
    // after, the whole process will become more resilient and faster.
    await this.newPointsQueue.add(payload);
  }
}

export type SocketPayload = {
  route_id: string;
  lat: number;
  lng: number;
};
