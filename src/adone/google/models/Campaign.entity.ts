import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn
} from "typeorm";
import { Users } from "../../../authentication/models/entity/Users.entity";

export enum CampaignType {
	Search = "search",
	Display = "display",
	Video = "video",
	Shopping = "shopping",
	Discovery = "discovery",
	App = "app",
	Local = "local",
	Smart = "smart"
}

export enum BiddingStrategyType {
	UNSPECIFIED = "UNSPECIFIED",
	UNKNOWN = "UNKNOWN",
	COMMISSION = "COMMISSION",
	ENHANCED_CPC = "ENHANCED_CPC",
	INVALID = "INVALID",
	MANUAL_CPC = "MANUAL_CPC",
	MANUAL_CPM = "MANUAL_CPM",
	MANUAL_CPV = "MANUAL_CPV",
	MAXIMIZE_CONVERSIONS = "MAXIMIZE_CONVERSIONS",
	MAXIMIZE_CONVERSION_VALUE = "MAXIMIZE_CONVERSION_VALUE",
	PAGE_ONE_PROMOTED = "PAGE_ONE_PROMOTED",
	PERCENT_CPC = "PERCENT_CPC",
	TARGET_CPA = "TARGET_CPA",
	TARGET_CPM = "TARGET_CPM",
	TARGET_IMPRESSION_SHARE = "TARGET_IMPRESSION_SHARE",
	TARGET_OUTRANK_SHARE = "TARGET_OUTRANK_SHARE",
	TARGET_ROAS = "TARGET_ROAS",
	TARGET_SPEND = "TARGET_SPEND"
}

export enum AdvertisingChannelType {
	UNSPECIFIED,
	UNKNOWN,
	SEARCH,
	DISPLAY,
	SHOPPING,
	HOTEL,
	VIDEO,
	MULTI_CHANNEL,
	LOCAL,
	SMART,
}

export enum AdServingOptimizationStatus {
	UNSPECIFIED,
	UNKNOWN,
	OPTIMIZE,
	CONVERSION_OPTIMIZE,
	ROTATE,
	ROTATE_INDEFINITELY,
	UNAVAILABLE
}

export enum ExperimentType {
	UNSPECIFIED,
	UNKNOWN,
	BASE,
	DRAFT,
	EXPERIMENT
}

export enum GeoTargetTypeSetting {
	UNSPECIFIED,
	UNKNOWN,
	PRESENCE_OR_INTEREST,
	SEARCH_INTEREST,
	PRESENCE
}

export enum PaymentMethod {
	UNSPECIFIED,
	UNKNOWN,
	CLICKS,
	CONVERSION_VALUE,
	CONVERSIONS,
	GUEST_STAY
}

export enum ServingStatus {
	UNSPECIFIED,
	UNKNOWN,
	SERVING,
	NONE,
	ENDED,
	PENDING,
	SUSPENDED
}

export enum AdStatus {
	UNSPECIFIED,
	UNKNOWN,
	ENABLED,
	PAUSED,
	REMOVED
}

@Entity()
export class GoogleAdsCampaign {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({
		type: "enum",
		enum: CampaignType,
		default: CampaignType.Search
	})
	campaign_type!: CampaignType

	@Column()
	campaign_name!: string

	@Column({ type: "float" })
	campaign_budget!: number

	@Column({
		type: "enum",
		enum: BiddingStrategyType,
		default: BiddingStrategyType.MANUAL_CPC
	})
	bidding_strategy_type!: BiddingStrategyType
	
	@Column({
		type: "enum",
		enum: AdvertisingChannelType,
		default: AdvertisingChannelType.DISPLAY
	})
	advertising_channel_type!: AdvertisingChannelType
	
	@Column({
		type: "enum",
		enum: AdServingOptimizationStatus,
		default: AdServingOptimizationStatus.CONVERSION_OPTIMIZE
	})
	ad_serving_optimization_status!: AdServingOptimizationStatus
	
	@Column({
		type: "enum",
		enum: ExperimentType,
		default: ExperimentType.BASE
	})
	experiment_type!: ExperimentType
	
	@Column({
		type: "enum",
		enum: GeoTargetTypeSetting,
		default: GeoTargetTypeSetting.PRESENCE
	})
	geo_target_type_setting!: GeoTargetTypeSetting
	
	@Column({
		type: "enum",
		enum: PaymentMethod,
		default: PaymentMethod.UNSPECIFIED
	})
	payment_method!: PaymentMethod
	
	@Column({
		type: "enum",
		enum: AdStatus,
		default: AdStatus.PAUSED
	})
	ad_status!: AdStatus
	
	@Column({
		type: "enum",
		enum: ServingStatus,
		default: ServingStatus.NONE
	})
	serving_status!: ServingStatus

	@Column('simple-array')
	frequency_caps!: object[]
	
	@Column('simple-array')
	labels!: string[]

	@Column('simple-json')
	network_settings: {
		target_content_network: boolean
		target_google_search: boolean
		target_partner_search_network: boolean
		target_search_network: boolean
	}

	@Column('simple-json')
	optimization_goal_setting: {
		optimization_goal_types: Array<string>
	}
	
	@Column('simple-json')
	selective_optimization: {
		conversion_actions: Array<string>
	}
	
	@Column('simple-json')
	real_time_bidding_setting: {
		opt_in: boolean
	}
	
	@Column('simple-json')
	shopping_setting: {
		campaign_priority: number
		enable_local: boolean
		merchant_id: number
		sales_country: string
	}

	@Column('float8')
	optimization_score: number

	@Column({ nullable: true })
	resource_name!: string

	@Column({ nullable: true })
	base_campaign!: string

	@Column()
	campaign_start_date!: Date
	
	@Column()
	campaign_end_date!: Date

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