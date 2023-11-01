import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "services/prisma/prisma.service";
import { EEnviromentKey } from "shared/constants/env.constants";
import { WsUnauthorizedException } from "./exceptions/ws.exception";

@Injectable()
export class WebSocketJwtStrategy extends PassportStrategy(Strategy, "WebSocketJwtStrategy") {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromHeader("authorization")]),
      secretOrKey: configService.get<string>(EEnviromentKey.SECRET_JWT),
    });
  }

  async validate(payload: User): Promise<User> {
    const email = payload.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new WsUnauthorizedException("Unauthorized");
    }

    return user;
  }
}
