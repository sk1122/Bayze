import {
	Entity,
	Column,
	OneToOne,
	JoinColumn,
	PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users.entity";

@Entity()
export class SocialAccount {
    @PrimaryGeneratedColumn()
    id!: number

	@Column({ nullable: true })
	provider_id!: string

	@Column({ nullable: true })
	username!: string

	@Column({ nullable: true })
	displayName!: string

	@Column({ nullable: true })
	gender!: string

	@Column({ nullable: true })
	profileURL!: string

	@Column({ nullable: true })
	photos!: string

	@Column({ nullable: true })
	email!: string

	@Column('jsonb', { nullable: true })
	json!: object

	@Column({ nullable: true })
	provider!: string

	@OneToOne(() => Users)
	@JoinColumn()
	user!: Users
}