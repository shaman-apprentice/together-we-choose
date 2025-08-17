import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AdminAuthService } from "./admin-auth.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {
	constructor(private adminAuthService: AdminAuthService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();
		if (this.adminAuthService.isLoggedIn(request))
			return true;

		throw new UnauthorizedException();
	}
}
