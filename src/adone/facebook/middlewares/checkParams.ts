import express, { Request, Response, NextFunction } from "express"
export const validateParams = function (requestParams: any) {
	return function (req: Request, res: Response, next: NextFunction) {
		for (let param of requestParams) {
			if (checkParamPresent(Object.keys(req.query), param)) {
				let reqParam = req.query[param.param_key];
				if (!checkParamType(reqParam, param)) {
					res.status(400).send({
						result: `${param.param_key} is of type ` +
						`${typeof reqParam} but should be ${param.type}`
					});
					return
				} else {
					if (!runValidators(reqParam, param)) {
						res.status(400).send({
							result: `Validation failed for ${param.param_key}`
						});
						return
					}
				}
			} else if (param.required){
				res.status(400).send({
					result: `Missing Parameter ${param.param_key}`
				});
				return
			}
		}
		next();
	}
};

const checkParamPresent = function (reqParams: any, paramObj: any) {
	return (reqParams.includes(paramObj.param_key));
};

const checkParamType = function (reqParams: any, paramObj: any) {
	const reqParamType = typeof reqParams;
	return reqParamType === paramObj.type;
};

const runValidators = function (reqParams: any, paramObj: any) {
	for (let validator of paramObj.validator_functions) {
		if (!validator(reqParams)) {
			return false
		}
	}
	return true;
};

module.exports = {
	validateParams: validateParams
};