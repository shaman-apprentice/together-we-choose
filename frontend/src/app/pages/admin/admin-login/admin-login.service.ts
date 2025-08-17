import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AdminLoginDTO, IsAdminLoggedInDTO } from "@together-we-choose/shared";
import { firstValueFrom, map, Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class AdminLoginService {
	#http = inject(HttpClient);
	#isLoggedIn = false;

	async login(password: string): Promise<void> {
		const payload: AdminLoginDTO = { password }
		await firstValueFrom(this.#http.post<void>("/api/admin/auth/login", payload));
		this.#isLoggedIn = true;
	}

	async logout(): Promise<void> {
		await firstValueFrom(this.#http.post<void>("/api/admin/auth/logout", null));
		this.#isLoggedIn = false;
	}

	isLoggedIn(): Observable<boolean> {
		if (this.#isLoggedIn)
			return of(true);
		
		return this.#http.get<IsAdminLoggedInDTO>("/api/admin/auth/is-logged-in").pipe(
			map(response => response.isLoggedIn),
		);
	}
}
