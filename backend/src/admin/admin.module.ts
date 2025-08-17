import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { getEnv } from "../env.config";
import { AdminAuthController } from "./admin-auth.controller";
import { AdminAuthService } from "./admin-auth.service";
import { ReviewSubmittedSharedStoryController } from "./review-submitted-shared-story.controller";
import { ReviewSubmittedFeedbackController } from "./review-submitted-feedback.controller";
import { SharedStoryAdminController } from "./shared-story-admin.controller";

@Module({
	controllers: [
		AdminAuthController,
		ReviewSubmittedSharedStoryController,
		ReviewSubmittedFeedbackController,
		SharedStoryAdminController,
	],
	providers: [
		AdminAuthService,
	]
})
export class AdminModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(cookieParser(getEnv().cookieSecret))
			.forRoutes("*");
	}
}