import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDivider, MatListModule } from "@angular/material/list";
import { AdminLoginService } from "../../pages/admin/admin-login/admin-login.service";

@Component({
	selector: "app-admin-shell",
	templateUrl: "admin-shell.component.html",
	styleUrl: "admin-shell.component.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
		MatDivider,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class AdminShellComponent {
  protected readonly navItems = [
    { label: "Submitted Shared Stories", path: "review-submitted-shared-stories" },
    { label: "Submitted Feedback", path: "review-submitted-feedback" },
  ] as const;

	#adminLoginService = inject(AdminLoginService);
	#router = inject(Router);

	async logout() {
		await this.#adminLoginService.logout();
		await this.#router.navigate(['']);
	}
}
