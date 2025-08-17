import { Injectable, OnDestroy, signal } from '@angular/core';
import { inferMimeTypeFromBlob } from '@together-we-choose/shared';
import { createLarge, createThumbnail, ProcessedImage } from './image.helper';

@Injectable()
export class ShareStoryImageService implements OnDestroy {
	isProcessing = signal(false);
  processingError = signal<string | null>(null);
	processedImage = signal<ProcessedImage | null>(null);

	ngOnDestroy(): void {
    const processedImage = this.processedImage();
		if (processedImage !== null) {
			URL.revokeObjectURL(processedImage.thumbnail.asUrl);
			URL.revokeObjectURL(processedImage.large.asUrl);
		}
  }

  removeImage(): void {
		const processedImage = this.processedImage();
		if (processedImage !== null) {
			URL.revokeObjectURL(processedImage.thumbnail.asUrl);
			URL.revokeObjectURL(processedImage.large.asUrl);
		}

    this.processingError.set(null);
    this.processedImage.set(null);
  }

  async uploadImage(file: File): Promise<ProcessedImage | null> {
		try {
			this.isProcessing.set(true);
			this.processingError.set(null);
			const mimeType = inferMimeTypeFromBlob(file);
			const [ thumbnail, large ] = await Promise.all([
				createThumbnail(file, mimeType),
				createLarge(file, mimeType),
			]) ;
			const processedImage = { thumbnail, large };
			this.processedImage.set(processedImage);
			return processedImage;
    } catch (error) {
      this.processingError.set($localize`:@@share.image.error.processing:We could not prepare your image. Please try a different file.`);
			return null;
		}
		 finally {
      this.isProcessing.set(false);
    }
  }
}
