import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import type { CookieOptions, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { getEnv } from "../env.config";

@Injectable()
export class AdminAuthService {
	readonly #sessions = new Set<string>();
	readonly #sessionDurationInMs = 60 * 60 * 1000; // 1h
	readonly #adminPassword = getEnv().adminPassword;
	readonly #authCookieKey = 'id';
	readonly #cookieOpts: CookieOptions = {
		path: '/api/admin',
		secure: true,
		httpOnly: true,
		sameSite: true,
		signed: true,
		maxAge: this.#sessionDurationInMs,
	} as const;

	readonly #baseBackoffInMs = 3000;
	readonly #maxBackoffInMs = 5 * 60 * 1000; // 5min
	#failedAttempts = 0;
	#nextAllowedLoginTs = 0;

	/** @returns void, setting auth cookie as side-effect */
	login(response: Response, adminPassword: string): void {
		const now = Date.now();

		if (adminPassword !== this.#adminPassword) {
			this.#failedAttempts += 1;
			const delay = Math.min(this.#baseBackoffInMs * (2 ** (this.#failedAttempts - 1)), this.#maxBackoffInMs);
			this.#nextAllowedLoginTs = now + delay;
			throw new UnauthorizedException();
		}

		if (now < this.#nextAllowedLoginTs)
			throw new HttpException("To many failed login requests", HttpStatus.TOO_MANY_REQUESTS);

		this.#failedAttempts = 0;
		this.#nextAllowedLoginTs = 0;

		const identifier = randomUUID();
		this.#sessions.add(identifier);
		response.cookie(this.#authCookieKey, identifier, this.#cookieOpts);

		setTimeout(() => {
			this.#sessions.delete(identifier);
		}, this.#sessionDurationInMs)
	}

	logout(request: Request, response: Response) {
		const identifier = request.signedCookies?.[this.#authCookieKey];
		if (identifier) {
			this.#sessions.delete(identifier);
			response.clearCookie(this.#authCookieKey, this.#cookieOpts);
		}
	}

	isLoggedIn(request: Request): boolean {
		const identifier = request.signedCookies?.[this.#authCookieKey];
		return this.#sessions.has(identifier);
	}
}