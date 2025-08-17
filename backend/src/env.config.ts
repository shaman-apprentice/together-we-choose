import path from 'node:path';
import { existsSync } from 'node:fs';
import { config as loadEnv } from 'dotenv';

export type EnvConfig = {
	adminPassword: string;
	cookieSecret: string;
	pathToAngularApp: string;
	pathToDb: string;
  pathToImageDir: string;
	port: number;
};

export function getEnv(): EnvConfig {
	if (envConfig === null)
		envConfig = readEnv();

	return envConfig;
}

let envConfig: EnvConfig | null = null;

function readEnv(): EnvConfig {
	for (const relativePath of ['.env', '.env.local']) {
		const absolutePath = path.resolve(process.cwd(), relativePath);
		if (existsSync(absolutePath))
			loadEnv({ path: absolutePath, override: true, quiet: true });
	}

	const envConfig = {
		adminPassword: process.env.ADMIN_PASSWORD,
		cookieSecret: process.env.COOKIE_SECRET,
		pathToAngularApp: toAbsolutePath(process.env.PATH_TO_FRONTEND),
		pathToDb: toAbsolutePath(process.env.PATH_TO_DB),
	    pathToImageDir: toAbsolutePath(process.env.PATH_TO_IMAGE_DIR),
		port: process.env.PORT !== undefined ? parseInt(process.env.PORT) : -1,
	};
	const missingEnvVars: string[] = [];

	if (!envConfig.adminPassword)
		missingEnvVars.push('ADMIN_PASSWORD');
	if (!envConfig.cookieSecret)
		missingEnvVars.push('COOKIE_SECRET');
	if (!envConfig.pathToAngularApp)
		missingEnvVars.push('PATH_TO_FRONTEND');
	if (!envConfig.pathToDb)
		missingEnvVars.push('PATH_TO_DB');
	if (!envConfig.pathToImageDir)
		missingEnvVars.push('PATH_TO_IMAGE_DIR');
	if (Number.isNaN(envConfig.port) || envConfig.port <= 0)
		missingEnvVars.push('PORT');

	if (missingEnvVars.length > 0)
		throw new Error(`The following environment variables are not set or invalid: ${missingEnvVars.join(',')}`);

	return envConfig as EnvConfig;
}

function toAbsolutePath(envValue: string | undefined): string | undefined {
	if (!envValue)
		return envValue;

	return path.resolve(process.cwd(), envValue);
}
