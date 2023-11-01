import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { Prisma, User } from "@prisma/client";
import { RegisterUserDTO } from "modules/auth/dtos/register-auth.dto";
import { AuthHelpers } from "shared/helpers/auth.helpers";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  private async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.userRepository.findOne(userWhereUniqueInput);
  }

  async findFirst(where: Prisma.UserWhereInput): Promise<User | null> {
    return this.userRepository.findFirst(where);
  }

  async create(user: RegisterUserDTO): Promise<User> {
    if (await this.isExistingEmail(user.email)) {
      throw new BadRequestException("Email is exist");
    }

    const newUser = {
      ...user,
      password: (await AuthHelpers.hash(user.password)) as string,
      emailVerifiedAt: new Date(),
    };

    const createdUser = await this.userRepository.create(newUser);

    return createdUser;
  }

  async isExistingEmail(email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }
}
