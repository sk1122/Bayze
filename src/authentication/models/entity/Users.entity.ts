import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	getRepository
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs"
import { Organization } from "../../../organization/models/entity/Organization.entity";


@Entity()
@Unique(["email"])
export class Users {
	@PrimaryGeneratedColumn("uuid")
	id!: string

	@Column()
	email!: string

	@Column({ select: false })
	@Length(4, 100)
	password!: string

	@Column("simple-array", { nullable: true })
	role!: string[]

	@Column({ default: false })
	is_accepted_to_org!: boolean

	@Column()
	@CreateDateColumn()
	create_date!: Date

	@Column()
	@UpdateDateColumn()
	update_column!: Date

	@Column({ default: true })
	is_active!: boolean

	hashPassword() {
		this.password = bcrypt.hashSync(this.password, 8)
	}

	async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
		const userRepository = await getRepository(Users)
		let user = await userRepository.findOne({ where: { id: this.id } })
		return bcrypt.compareSync(unencryptedPassword, user.password);
	}
}