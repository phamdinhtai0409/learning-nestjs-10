import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { PrismaModule } from "services/prisma/prisma.module";
import { PrismaService } from "services/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { WebSocketJwtStrategy } from "./chat.jwt.strategy";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [PrismaModule],
  providers: [ChatGateway, JwtService, ConfigService, WebSocketJwtStrategy, PrismaService],
  controllers: [],
})
export class ChatModule {}
