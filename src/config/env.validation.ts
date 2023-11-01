import { plainToClass } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsPort, IsString, validateSync } from "class-validator";
import { EEnviromentKey, ENodeEnvironment } from "shared/constants/env.constants";

export function envValidate(config: Record<string, any>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

class EnvironmentVariables implements Record<EEnviromentKey, number | string> {
  // App
  @IsEnum(ENodeEnvironment)
  @IsNotEmpty()
  NODE_ENV: ENodeEnvironment;

  @IsPort()
  @IsOptional()
  PORT: string;

  @IsString()
  @IsOptional()
  GLOBAL_PREFIX: string;

  // Swagger
  @IsString()
  @IsOptional()
  SWAGGER_PATH: string;

  @IsString()
  @IsOptional()
  SWAGGER_TITLE: string;

  @IsString()
  @IsOptional()
  SWAGGER_DESCRIPTION: string;

  @IsString()
  @IsOptional()
  SWAGGER_VERSION: string;

  // Jwt
  @IsString()
  @IsNotEmpty()
  SECRET_JWT: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET_JWT: string;

  // Database
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}
