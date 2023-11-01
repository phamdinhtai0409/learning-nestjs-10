import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { Role } from "shared/constants/global.constants";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { User } from "@prisma/client";
import { CurrentUser } from "shared/decorators/currentUser.decorator";
import { ApiResponse } from "@nestjs/swagger";
import { CurrentUserDto } from "./dto/current-user.dto";
import { plainToInstance } from "class-transformer";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @HasRoles(Role.USER)
  @ApiResponse({ type: CurrentUserDto })
  async whoAmI(@CurrentUser() user: User): Promise<CurrentUserDto> {
    return plainToInstance(CurrentUserDto, user);
  }
}
