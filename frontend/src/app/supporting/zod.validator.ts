import { ValidatorFn } from "@angular/forms";
import * as z from "zod";

export function zodValidator<T>(schema: z.ZodType<T>): ValidatorFn {
	return ctrl => {
		const validation = schema.safeParse(ctrl.value);
		if (validation.success)
			return null;

		return { errorMessage: z.prettifyError(validation.error) };
	}
}