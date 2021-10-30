import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Organization } from "../models/entity/Organization.entity";

export const organizationRepository = async (req: Request, res: Response, next: NextFunction) => {
	
	let organizationRepository = getRepository(Organization)

	res.locals.organizationRepository = organizationRepository
	next()
}