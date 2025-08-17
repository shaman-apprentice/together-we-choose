import * as z from "zod";
import { ISODateString } from "../../types/iso-date-string.js";
import { RelationshipStatus } from "../../types/relationship-status.js";

export const SubmitSharedStoryDTO = z.object({
	name: z.string().max(30).nullable().optional(),
	relationshipStatus: z.enum(RelationshipStatus),
	email: z.email().nullable().optional(),
	story: z.string().trim().min(30).max(4000),
	placeholderImage: z.string(),
	privacyPolicyConfirmed: z.union([z.boolean(), z.string()])
		.refine(value => value === true || value === "true")
		.transform(() => true),
});

export type SubmitSharedStoryDTO = z.infer<typeof SubmitSharedStoryDTO>
export type SharedStoryBaseDTO = Omit<SubmitSharedStoryDTO, "placeholderImage" | "privacyPolicyConfirmed">;

export type SubmittedSharedStoryDTO = SharedStoryBaseDTO & {
	id: number;
	createdAt: ISODateString;
	image: null | {
		thumbnailUrl: string;
		largeUrl: string;
	};
}

export type AcceptSharedStoriesDTO = {
	ids: number[];
}

export type DeleteSharedStoriesDTO = {
	ids: number[];
}
