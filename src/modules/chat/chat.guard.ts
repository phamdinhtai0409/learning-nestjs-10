import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "services/prisma/prisma.service";
import { EEnviromentKey } from "shared/constants/env.constants";
import { WsUnauthorizedException } from "./exceptions/ws.exception";

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { authorization } = context.switchToWs().getClient().handshake.headers;

    try {
      const payload = this.jwtService.verify(authorization, {
        secret: this.configService.get<string>(EEnviromentKey.SECRET_JWT),
      });

      const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

      if (!user) {
        return false;
      }

      context.switchToWs().getClient()["user"] = user;
    } catch (error) {
      throw new WsUnauthorizedException("Unauthentication");
    }

    return true;
  }
}
