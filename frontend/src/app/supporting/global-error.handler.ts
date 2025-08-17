import { ErrorHandler, inject } from "@angular/core";
import { SnackBarService } from "../services/snack-bar.service";

export class GlobalErrorHandler implements ErrorHandler {
	#snackBar = inject(SnackBarService); 
	
	handleError(error: any): void {
		console.error(error);

		this.#snackBar.open("An unexpected error has occurred.");
	}
}
