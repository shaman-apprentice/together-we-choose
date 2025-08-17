import { Module } from '@nestjs/common';
import { SharedStoriesController } from './shared-stories.controller';

@Module({
  controllers: [SharedStoriesController],
})
export class SharedStoriesModule {}
