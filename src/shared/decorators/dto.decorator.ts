import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

interface IDtoDecoratorOption {
  optional?: boolean;
  expose?: boolean;
}

interface IDtoOptionsInitDecorators extends IDtoDecoratorOption {
  propertyType?: string | Function | [Function] | Record<string, any>;
}

function initializeDecorators(
  options: IDtoOptionsInitDecorators,
  additionMiddle: (decorators: PropertyDecorator[]) => any,
) {
  const ApiPropertyOpts = {} as ApiPropertyOptions;

  if (options?.optional) {
    ApiPropertyOpts.required = false;
  }

  if (options?.propertyType) {
    ApiPropertyOpts.type = options.propertyType;
  }

  const decorators = [ApiProperty(ApiPropertyOpts)];

  if (options?.expose) {
    decorators.push(Expose());
  }

  additionMiddle(decorators);

  if (options?.optional) {
    decorators.push(IsOptional());
  } else {
    decorators.push(IsNotEmpty());
  }

  return applyDecorators(...decorators);
}
