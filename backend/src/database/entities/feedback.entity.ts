import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'feedback' })
export class FeedbackEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	id!: number;

	@Column({ type: 'text', nullable: true })
	email!: string | null;

	@Column({ type: 'text' })
  feedback!: string;

	@Column({type: 'datetime' })
  createdAt!: Date;
}
