import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001)
export class NaetverkGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('NaetverkGateway');

  afterInit(server: Server): any {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected ${client.id}`);
    client.emit('welcome');
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected ${client.id}`);
  }
  /*
  @SubscribeMessage('nodecreate')
  nodecreate(@MessageBody() payload, @ConnectedSocket() client: Socket) {
    this.logger.log(`client ${client.id} send: ${payload}`);
    client.broadcast('nodecreate', payload)
   // this.wss.emit('nodecreate', payload);
  }*/

  @SubscribeMessage('nodecreate')
  async nodeCreate(client, payload) {
    client.broadcast.emit('nodecreate', payload);
  }

  @SubscribeMessage('nodedragged')
  async nodeDragged(client, payload) {
    client.broadcast.emit('nodedragged', payload);
  }
}
