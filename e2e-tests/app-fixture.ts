import { test as base, type Page } from '@playwright/test';
import { StartedTestContainer } from 'testcontainers';
import { loginAsAdmin } from './utils/admin-login';
import { startApp } from './utils/app.starter';
import { UserFlowPortMapping } from './utils/user-flow-port-mapping';


type AppFixture = {
	adminPage: Page;
};

export const test = base.extend<AppFixture>({
	adminPage: async ({ page }, use) => {
		await loginAsAdmin(page);
		await use(page);
	},
});

export function setupUserFlowTest(flow: keyof typeof UserFlowPortMapping) {
	let app: StartedTestContainer | null = null;
	const appPort = UserFlowPortMapping[flow];

	test.use({ baseURL: `http://localhost:${appPort}` });

	test.beforeAll(async () => {
		app = await startApp(appPort);
	});

	test.afterAll(async () => {
		if (app !== null)
			await app.stop();
	});
}

export { expect } from '@playwright/test';
