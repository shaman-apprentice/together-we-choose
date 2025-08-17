import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import type { AdminLoginDTO, IsAdminLoggedInDTO } from "@together-we-choose/shared";
import type { Request, Response } from "express";
import { AdminAuthService } from "./admin-auth.service";

@Controller('auth')
export class AdminAuthController {
	constructor(private adminAuthService: AdminAuthService) {}

	@Post('login')
	login(
		@Res({ passthrough: true }) response: Response,
		@Body() body: AdminLoginDTO,
	) {
		this.adminAuthService.login(response, body.password);
	}

	@Post('logout')
	logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		this.adminAuthService.logout(request, response);
	}

	@Get('is-logged-in')
	isLoggedIn(@Req() request: Request): IsAdminLoggedInDTO {
		return {
			isLoggedIn: this.adminAuthService.isLoggedIn(request),
		};
	}
}
