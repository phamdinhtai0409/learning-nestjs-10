import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { EEnviromentKey } from "./shared/constants/env.constants";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import { AppModule } from "modules/app/app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get<string>(EEnviromentKey.GLOBAL_PREFIX) || "api");

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>(EEnviromentKey.SWAGGER_TITLE) || "Nestjs")
    .setDescription(configService.get<string>(EEnviromentKey.SWAGGER_DESCRIPTION) || "Nestjs API description")
    .setVersion(configService.get<string>(EEnviromentKey.SWAGGER_VERSION) || "1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(configService.get<string>(EEnviromentKey.SWAGGER_PATH || "api/docs"), app, document);

  // App setup
  const port = configService.get<string>(EEnviromentKey.PORT) || 3000;

  await app.listen(port, () => {
    Logger.log(`Server started listening on port: ${port}`);
    Logger.log(`Running in ${process.env.NODE_ENV} mode`);
  });
}
bootstrap();
