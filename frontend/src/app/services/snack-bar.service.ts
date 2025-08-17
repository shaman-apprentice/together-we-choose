import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({ providedIn: "root" })
export class SnackBarService {
	#snackBar = inject(MatSnackBar); 

	open(msg: string, actionLabel = "Close", config: MatSnackBarConfig = {}) {
		this.#snackBar.open(msg, actionLabel, {
			horizontalPosition: "right",
			verticalPosition: "top",
			...config,
		});
	}
}
