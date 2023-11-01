import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, LoginResponseDTO } from "./dtos/login-auth.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { Role } from "shared/constants/global.constants";
import { HasRoles } from "./auth.has-roles.decorator";
import { RegisterUserDTO, RegisterUserResponseDTO } from "./dtos/register-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/user/login")
  @HasRoles(Role.PUBLIC)
  @ApiOkResponse({ type: LoginResponseDTO })
  async loginUser(@Body() user: LoginDTO): Promise<LoginResponseDTO> {
    return this.authService.login(user, Role.USER);
  }

  @Post("/user/register")
  @HasRoles(Role.PUBLIC)
  @ApiOkResponse({ type: RegisterUserResponseDTO })
  async register(@Body() user: RegisterUserDTO): Promise<RegisterUserResponseDTO> {
    const registeredUser = await this.authService.register(user);

    return registeredUser;
  }
}
