import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CustomConfigModule } from "config/config.module";
import { AuthModule } from "modules/auth/auth.module";
import { LoggerHttpRequestMiddleware } from "middlewares/logger.middleware";
import { UserModule } from "modules/user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "modules/auth/auth.jwt.guard";
import { PipeModule } from "shared/pipes/pipe.module";
import { ChatModule } from "modules/chat/chat.module";

@Module({
  imports: [CustomConfigModule, AuthModule, UserModule, PipeModule, ChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerHttpRequestMiddleware).forRoutes("*");
  }
}
