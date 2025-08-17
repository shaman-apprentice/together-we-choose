import { RelationshipStatus } from '@together-we-choose/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'shared_stories' })
export class SharedStoryEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ type: 'text', nullable: true })
  name!: string | null;

  @Column({ type: 'simple-enum', enum: RelationshipStatus })
  relationshipStatus!: RelationshipStatus;

  @Column({ type: 'text', nullable: true })
  email!: string | null;

  @Column({ type: 'text' })
  story!: string;

	@Column({ type: 'text', nullable: true })
  imageThumbnailUrl!: string | null;

	@Column({ type: 'text', nullable: true })
  imageLargeUrl!: string | null;

  @Column({type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;
}
