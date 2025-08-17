import * as z from "zod";
import { ISODateString } from "../../types/iso-date-string.js";

export const SubmitFeedbackDTO = z.object({
	email: z.email().nullable(),
	feedback: z.string().trim().min(5).max(4000),
});

export type SubmitFeedbackDTO = z.infer<typeof SubmitFeedbackDTO>

export const DeleteFeedbackDTO = z.object({
	ids: z.array(z.number().int().positive()).min(1),
});

export type DeleteFeedbackDTO = z.infer<typeof DeleteFeedbackDTO>

export type FeedbackDTO = SubmitFeedbackDTO & {
	id: number;
	createdAt: ISODateString;
}
