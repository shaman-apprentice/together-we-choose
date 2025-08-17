import { mimeType2FileExt } from '@together-we-choose/shared';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getEnv } from '../env.config';

export class ImageService {
	static readonly serveImagesPath = '/images';

	static readonly #imageDir = getEnv().pathToImageDir;

	static async saveStoryImages(
		baseName: string | number,
		thumbnail: Express.Multer.File,
		large: Express.Multer.File
	): Promise<{ thumbnailUrl: string, largeUrl: string }> {
		const thumbnailFileName = baseName + '-thumbnail' + mimeType2FileExt(thumbnail.mimetype);
		const largeFileName = baseName + '-large' + mimeType2FileExt(large.mimetype);

		await Promise.all([
			writeFile(join(ImageService.#imageDir, thumbnailFileName), thumbnail.buffer),
			writeFile(join(ImageService.#imageDir, largeFileName), large.buffer),
		]);

		return {
			thumbnailUrl: ImageService.fileName2Url(thumbnailFileName),
			largeUrl: ImageService.fileName2Url(largeFileName),
		};
	}

	static fileName2Url(fileName: string): string {
		return `${ImageService.serveImagesPath}/${fileName}`;
	}

	static url2FileLocation(url: string): string {
		return url.replace(ImageService.serveImagesPath, ImageService.#imageDir);
	}
}
