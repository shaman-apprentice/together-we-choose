import { z } from "zod";
import { imageMimeTypes } from "../../types/image.types.js";

export const SharedStoryThumbnailImage = z
	.file()
	.max(512 * 1024) // 512 KB
	.mime(imageMimeTypes);

export const SharedStoryLargeImage = z
	.file()
	.max(5 * 1024 * 1024) // 5 MB
	.mime(imageMimeTypes);
