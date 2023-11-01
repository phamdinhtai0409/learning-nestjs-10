import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDTO, LoginResponseDTO } from "./dtos/login-auth.dto";
import { Role } from "@prisma/client";
import { AuthHelpers } from "shared/helpers/auth.helpers";
import { UserService } from "modules/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EEnviromentKey } from "shared/constants/env.constants";
import { RegisterUserDTO, RegisterUserResponseDTO } from "./dtos/register-auth.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginUserDTO: LoginDTO, role: Role): Promise<LoginResponseDTO> {
    const userData = await this.userService.findFirst({
      email: loginUserDTO.email,
      role,
    });

    if (!userData) {
      throw new BadRequestException("user not found");
    }

    const isMatch = await AuthHelpers.verify(loginUserDTO.password, userData.password);

    if (!isMatch) {
      throw new BadRequestException("password do not match");
    }

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const secretKey = this.configService.get<string>(EEnviromentKey.SECRET_JWT);
    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: "1d",
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }

  async register(user: RegisterUserDTO): Promise<RegisterUserResponseDTO> {
    const createdUser = await this.userService.create(user);

    return plainToInstance(RegisterUserResponseDTO, createdUser);
  }
}
