import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaService } from "services/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { EEnviromentKey } from "shared/constants/env.constants";

const cookieExtractor = (req) => req?.cookies?.accessToken;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("token"),
        cookieExtractor,
      ]),
      secretOrKey: configService.get<string>(EEnviromentKey.SECRET_JWT),
    });
  }

  async validate(payload: User): Promise<User> {
    const email = payload.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
