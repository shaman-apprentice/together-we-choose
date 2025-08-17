import { ValidatorFn } from "@angular/forms";
import * as z from "zod";
import { ProcessedImage } from "./image.helper";
import { SharedStoryLargeImage, SharedStoryThumbnailImage } from "@together-we-choose/shared";

export const imageValidator: ValidatorFn = ctrl => {
	const image = ctrl.value as ProcessedImage | null;
	if (image === null)
		return null;

	const validatedLarge = SharedStoryLargeImage.safeParse(image.large.asFile);
	if (validatedLarge.error)
		return { errorMessage: z.prettifyError(validatedLarge.error) + " (scaled large image)"};

	const validatedThumbnail = SharedStoryThumbnailImage.safeParse(image.thumbnail.asFile);
	if (validatedThumbnail.error)
		return { errorMessage: z.prettifyError(validatedThumbnail.error) + " (scaled thumbnail image)"};

	return null;
}
