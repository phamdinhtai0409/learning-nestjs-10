import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { Role } from "shared/constants/global.constants";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HasRoles(Role.PUBLIC)
  getHello(): string {
    return this.appService.getHello();
  }
}
