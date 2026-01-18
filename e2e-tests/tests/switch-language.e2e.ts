import { test, expect, setupUserFlowTest } from '../app-fixture';

test.describe.serial('switch language flow', () => {
	setupUserFlowTest('switch language flow');

	test('user can switch language from English to German', async ({ page }) => {
		await page.goto('/');
		
		// Verify we're on English (default)
		await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
		
		// Open language menu
		await page.getByRole('button', { name: '🇬🇧' }).click();
		
		// Switch to German
		await page.getByRole('menuitem', { name: /🇩🇪.*German/ }).click();
		
		// Verify content is in German
		await expect(page.getByRole('link', { name: 'Startseite' })).toBeVisible();
	});
});
