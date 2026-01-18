import { Page } from '@playwright/test';

export const ADMIN_PASSWORD = 'test-admin-password';

export async function loginAsAdmin(page: Page): Promise<void> {
	await page.goto('/admin/login');
	
	const passwordInput = page.getByLabel('Password');
	await passwordInput.fill(ADMIN_PASSWORD);
	
	const loginButton = page.getByRole('button', { name: 'Login' });
	await loginButton.click();
	
	// Wait for navigation away from login page
	await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 });
}
