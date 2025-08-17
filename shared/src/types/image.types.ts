export const imageTypes = [
	"webp",
	"jpg",
	"jpeg",
	"avif",
	"png",
] as const

export const imageMimeTypes = imageTypes.map(type => `image/${type}`);

export function mimeType2FileExt(mimeType: string): string {
	for (const type of imageTypes)
		if (mimeType.endsWith(type))
			return "." + type;

	throw new Error(`Invalid mimeType '${mimeType}'`);
}

export function inferMimeTypeFromBlob(blob: Blob): string {
	if (imageMimeTypes.includes(blob.type))
		return blob.type;

	throw new Error('Could not infer mime type for given blob');
}
