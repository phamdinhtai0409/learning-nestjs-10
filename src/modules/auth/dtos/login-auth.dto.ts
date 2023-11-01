import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginResponseDTO {
  @ApiProperty()
  user: Partial<User>;

  @ApiProperty()
  accessToken: string;
}
