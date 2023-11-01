import { Logger, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { WebSocketJwtGuard } from "./chat.jwt-guard";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { Role } from "shared/constants/global.constants";

@WebSocketGateway({
  path: "/ws",
  namespace: "/chat",
  cors: {
    origin: "*",
  },
})
@UseGuards(WebSocketJwtGuard)
@HasRoles(Role.USER)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(this.constructor.name);

  @WebSocketServer()
  public readonly server: Server;

  afterInit() {
    this.logger.log("Initialized ChatGateway!");
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log("ChatGateway Connected: ", client.id);
  }

  handleDisconnect() {
    this.logger.log("ChatGateway Disconnected!");
  }

  @SubscribeMessage("message")
  async handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): Promise<void> {
    console.log(`body: ${message}, client: ${client.id}`);
  }
}
