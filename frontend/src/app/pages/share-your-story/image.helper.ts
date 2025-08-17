import { mimeType2FileExt } from '@together-we-choose/shared';

export type ProcessedImage = {
	thumbnail: ResizedImage;
	large: ResizedImage;
}

export type ResizedImage = {
	widthInPx: number;
	heightInPx: number;
	asFile: File,
	asUrl: string;
}

export async function createThumbnail(file: File, mimeType: string): Promise<ResizedImage> {
	const imageAsUrl = URL.createObjectURL(file);
	try {
		const image = await loadImageFromSrc(imageAsUrl);
		const scale = calculateScale()
		const fileName = createResizedFileName('thumbnailImage', mimeType);
		return resizeImage(image, 200, 200, scale, mimeType, fileName);

		function calculateScale(): number { // scale smaller side to be 200px
			if (image.naturalWidth <= 200 && image.naturalHeight <= 200)
				return 1;
			return image.naturalWidth < image.naturalHeight
				? 200 / image.naturalWidth
				: 200 / image.naturalHeight;
		}
	} finally {
		URL.revokeObjectURL(imageAsUrl);
	}
}

export async function createLarge(file: File, mimeType: string): Promise<ResizedImage> {
	const imageAsUrl = URL.createObjectURL(file);
	try {
		const image = await loadImageFromSrc(imageAsUrl);
		const target = image.naturalHeight > image.naturalWidth ? 768 : 1024;
		const scale = calculateScale();
		const targetWidth = Math.floor(image.naturalWidth * scale);
		const targetHeight = Math.floor(image.naturalHeight * scale);
		const fileName = createResizedFileName('largeImage', mimeType);
		return resizeImage(image, targetWidth, targetHeight, scale, mimeType, fileName)
		
		function calculateScale(): number { // scale bigger side to be at most target px
			if (image.naturalWidth <= target && image.naturalHeight <= target)
				return 1;
			return image.naturalWidth > image.naturalHeight
				? target / image.naturalWidth
				: target / image.naturalHeight;
		}
	} finally {
		URL.revokeObjectURL(imageAsUrl);
	}
}

async function resizeImage(
	image: HTMLImageElement,
	targetWidthInPx: number,
	targetHeighInPx: number,
	scale: number,
	mimeType: string,
	fileName: string,
): Promise<ResizedImage> {
	const { canvas, context } = getCanvas(targetWidthInPx, targetHeighInPx);
	const drawWidth = Math.round(image.naturalWidth * scale);
	const drawHeight = Math.round(image.naturalHeight * scale);
	const dx = Math.floor((targetWidthInPx - drawWidth) / 2); // center or crop image left/right same amount
	const dy = Math.floor((targetHeighInPx - drawHeight) / 2); // center or crop image top/bottom same amount
	context.drawImage(image, dx, dy, drawWidth, drawHeight);

	const resizedImagFile = new File([await canvasToBlob(canvas, mimeType)], fileName, { type: mimeType });
	
	return {
		widthInPx: targetWidthInPx,
		heightInPx: targetHeighInPx,
		asUrl: URL.createObjectURL(resizedImagFile),
		asFile: resizedImagFile,
	}
}

function createResizedFileName(name: string, mimeType: string): string {
	const extension = mimeType2FileExt(mimeType);
	return `${name}${extension}`;
}

function getCanvas(widthInPx: number, heightInPx: number) {
	const canvas = document.createElement('canvas');
	canvas.width = widthInPx;
	canvas.height = heightInPx;
	const context = canvas.getContext('2d');
	if (!context)
		throw new Error('Cannot process image without Canvas support in your browser.');

	context.fillStyle = '#ffffff';
	context.fillRect(0, 0, canvas.width, canvas.height);
	return { canvas, context }
}

function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error('Image load failed'));
		image.src = src;
	});
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob !== null) {
				resolve(blob);
			} else {
				reject(new Error('Canvas conversion failed'));
			}
		}, mimeType, 1);
	});
}
