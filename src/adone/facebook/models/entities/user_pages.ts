import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn
} from "typeorm";
import { Users } from "../../../../authentication/models/entity/Users.entity";


@Entity()
export class Page {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ nullable: true })
	access_token!: string

	@Column()
	page_id!: string

	@Column()
	name!: string

	@Column("simple-json", { nullable: true })
	business!: any

	@Column()
	category!: string

	@Column("simple-json")
	category_list!: any

	@Column("simple-array")
	tasks!: string[]

	@Column()
	@CreateDateColumn()
	create_date!: Date

	@Column()
	@UpdateDateColumn()
	update_column!: Date
	
	@ManyToOne(() => Users, user => user.id)
	@JoinColumn()
	user!: Users
}