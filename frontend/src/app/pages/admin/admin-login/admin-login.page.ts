import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminLoginService } from './admin-login.service';

@Component({
	selector: 'app-admin-login-page',
	templateUrl: 'admin-login.page.html',
	styleUrl: 'admin-login.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule]
})
export class AdminLoginPage {
	#adminLoginService = inject(AdminLoginService);
	#router = inject(Router);

	protected form = inject(NonNullableFormBuilder).group({
		password: ['', Validators.required]
	});

	protected error = signal<string | null>(null);
	protected isSubmitting = signal(false);
	protected passwordInvalid = computed(() => this.form.controls.password.invalid && (this.form.controls.password.dirty || this.form.controls.password.touched));

	protected async submit(): Promise<void> {
		try {
			this.isSubmitting.set(true);
			this.error.set(null);
			await this.#adminLoginService.login(this.form.controls.password.value);
			await this.#router.navigate(['admin/review-submitted-shared-stories']);
		} catch (error) {
			console.log(error);
			this.error.set('Login failed. Please check your password and try again.');
		} finally {
			this.isSubmitting.set(false);
		}
	}
}
