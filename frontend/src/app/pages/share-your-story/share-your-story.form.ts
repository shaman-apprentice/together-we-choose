import { FormControl, FormGroup } from "@angular/forms";
import { RelationshipStatus, SubmitSharedStoryDTO } from "@together-we-choose/shared";
import { ProcessedImage } from "./image.helper";
import { zodValidator } from "../../supporting/zod.validator";
import { imageValidator } from "./image.validator";

export function createShareYourStoryForm() {
	return new FormGroup({
		name: new FormControl<string | null>(null, { validators: zodValidator(SubmitSharedStoryDTO.shape.name) }),
		email: new FormControl<string | null>(null, { validators: zodValidator(SubmitSharedStoryDTO.shape.email) }),
		relationshipStatus: new FormControl<RelationshipStatus>( RelationshipStatus.NoStatement, { nonNullable: true }),
		story: new FormControl<string>("", {
			nonNullable: true,
			validators: zodValidator(SubmitSharedStoryDTO.shape.story),
		}),
		image: new FormControl<ProcessedImage | null>(null, { validators: imageValidator }),
		placeholderImage: new FormControl<string>("story-image-placeholders/1.png", { nonNullable: true }),
		privacyPolicyConfirmed: new FormControl<boolean>(false, {	validators: zodValidator(SubmitSharedStoryDTO.shape.privacyPolicyConfirmed) }),
	});
}

export type ShareStoryForm = ReturnType<typeof createShareYourStoryForm>

export function story2FormData(story: SubmitSharedStoryDTO, image: ProcessedImage | null): FormData {
	const result = new FormData();

	if (story.privacyPolicyConfirmed)
		result.append("privacyPolicyConfirmed", "true");
	if (story.name)
		result.append("name", story.name)
	if (story.email)
		result.append("email", story.email)
	result.append("relationshipStatus", story.relationshipStatus);
	result.append("story", story.story);
	result.append("placeholderImage", story.placeholderImage);
		
	if (image !== null) {
		result.append('thumbnailImage', image.thumbnail.asFile);
		result.append('largeImage', image.large.asFile);
	}

	return result;
}
