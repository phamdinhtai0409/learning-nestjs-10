import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "modules/user/user.repository";
import { PrismaModule } from "services/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { PrismaService } from "services/prisma/prisma.service";
import { JwtStrategy } from "./auth.jwt.strategy";
import { AuthService } from "./auth.service";
import { UserService } from "modules/user/user.service";

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [AuthController],
  providers: [UserRepository, UserService, AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}
