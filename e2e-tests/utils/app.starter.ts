import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { mkdir, writeFile, rm } from 'fs/promises';
import path from 'path';
import { ADMIN_PASSWORD } from './admin-login';

export async function startApp(port: number): Promise<StartedTestContainer> {
	const storageDir = path.resolve(__dirname, `../test-storage/${port}`);
	const imagesDir = path.join(storageDir, 'images');
	const sqliteDir = path.join(storageDir, 'sqlite');
	const dbPath = path.join(sqliteDir, 'app.db');
	
	await Promise.all([
		rm(storageDir, { recursive: true, force: true }),
		rm(sqliteDir, { recursive: true, force: true }),
	])
	
	await Promise.all([
		mkdir(imagesDir, { recursive: true }),
		mkdir(sqliteDir, { recursive: true }),
	]);
	await writeFile(dbPath, '');

	return new GenericContainer('together-we-choose-e2e-test-image')
		.withName(`together-we-choose-e2e-test-image-${port}`)
		.withEnvironment({ 
			NODE_ENV: 'production',
			ADMIN_PASSWORD,
		})
		.withExposedPorts({ container: 3000, host: port })
		.withBindMounts([
			{ source: sqliteDir, target: '/usr/src/app/storage/sqlite' },
			{ source: imagesDir, target: '/usr/src/app/storage/images' },
		])
		.start();
}