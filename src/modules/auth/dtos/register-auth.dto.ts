import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class RegisterUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

@Exclude()
export class RegisterUserResponseDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;
}
