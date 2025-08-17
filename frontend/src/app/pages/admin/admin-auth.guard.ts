import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RedirectCommand, Router, RouterStateSnapshot } from "@angular/router";
import { AdminLoginService } from "./admin-login/admin-login.service";
import { map } from "rxjs";

export function adminAuthGuard(
	_route: ActivatedRouteSnapshot,
	_state: RouterStateSnapshot
): MaybeAsync<GuardResult> {
	const adminLoginService = inject(AdminLoginService);
	const router = inject(Router);

	return adminLoginService.isLoggedIn().pipe(
		map(isLoggedIn => isLoggedIn
			? true
			: new RedirectCommand(router.parseUrl('/admin/login'))
		),
	);
}
