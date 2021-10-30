import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	getRepository,
	JoinColumn
} from "typeorm";
import { Users } from "./Users.entity";

@Entity()
export class AccessToken {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	access_token!: string

	@Column({ nullable: true })
	provider!: string

	@ManyToOne(type => Users)
	@JoinColumn()
	user!: Users
}