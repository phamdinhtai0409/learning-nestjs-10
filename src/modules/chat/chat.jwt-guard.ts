import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Role } from "shared/constants/global.constants";
import { WsForbiddenException, WsUnauthorizedException } from "./exceptions/ws.exception";
import { User } from "@prisma/client";

@Injectable()
export class WebSocketJwtGuard extends AuthGuard("WebSocketJwtStrategy") {
  roles: string[];

  constructor(private reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.roles = this.reflector.get<string[]>("roles", context.getClass());

    if (this.roles?.includes(Role.PUBLIC)) {
      return true;
    }

    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }

  // @ts-ignore
  handleRequest(err: Error, user: User): User {
    if (err || !user) {
      throw err || new WsUnauthorizedException("Unauthorized");
    }

    if (!this.roles) {
      return user;
    }

    const hasPermission = this.roles.includes(user.role);
    if (!hasPermission) {
      throw new WsForbiddenException("Forbidden");
    }

    return user;
  }
}
