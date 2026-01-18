import { test, expect, setupUserFlowTest } from '../app-fixture';

test.describe.serial('feedback flow', () => {
	setupUserFlowTest('feedback flow');

	test('user can submit feedback', async ({ page }) => {
		await page.goto('/feedback');
		await page.fill('input[formControlName="email"]', 'test@example.com');
		await page.fill('textarea[formControlName="feedback"]', 'The site looks great!');
		await page.click('button[type="submit"]');
	
		await expect(page.locator('.app-submission-status-success')).toBeVisible();
		await expect(page.locator('.app-submission-status-success')).toContainText('Thank you');
	});

	test('admin can read and delete submitted feedback', async ({ adminPage }, testInfo) => {
		test.skip(testInfo.project.name === 'webkit', 'This test fails on webkit. However, as we use chromium or Firefox for admin we don\'t need it anyway.');
		
		await adminPage.goto('/admin/review-submitted-feedback');
		
		// Verify the submitted feedback is visible
		const feedbackCard = adminPage.locator('.feedback-card', { hasText: 'The site looks great!' });
		await expect(feedbackCard).toBeVisible();
		await expect(feedbackCard.getByRole('link', { name: 'test@example.com' })).toBeVisible();
		
		// Delete feedback
		await feedbackCard.click();
		await expect(feedbackCard).toHaveAttribute('aria-checked', 'true');
		await adminPage.getByRole('button', { name: 'Delete selected' }).click();
		
		// Verify feedback is deleted
		await expect(feedbackCard).not.toBeVisible();
		await expect(adminPage.getByText('No feedback submissions yet')).toBeVisible();
	});
})

