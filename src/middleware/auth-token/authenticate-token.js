/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */

const jwt = require('jsonwebtoken');
const { pool } = require('../../_DB/db');
const { setServerResponse } = require('../../utilities/server-response');
const { API_STATUS_CODE } = require('../../consts/error-status');

const checkUserId = async (
	id,
	employee_id,
	designation_id,
	depot_id,
	module_id,
) => {
	const query = `
  	SELECT
		*
	FROM
		employees
	WHERE
		id = ? AND
		employee_id = ? AND
		designation_id = ? AND
		depot_id = ? AND
		module_id = ? AND
		employee_status = ${1};
  	`;

	const values = [
		id,
		employee_id,
		designation_id,
		depot_id,
		module_id
	]

	try {
		const [result] = await pool.query(query, values);
		if (result.length > 0) {
			return true;
		}
		return false;
	} catch (error) {
		return error
	}

};


/**
 * @description This function is used to to verify user jwt token
 */
const authenticateToken = async (req, res, next) => {
	let user;
	const authHeader = (req.headers['authorization'] || req.body.token) + '';

	if (authHeader === null) {
		return res.status(API_STATUS_CODE.UNAUTHORIZED).send({
			status: 'failed',
			message: 'unauthorized_user'
		})
	} else {
		try {
			let token = authHeader.replace(/^[B|b]earer\s+/, '');

			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
				if (err) {
					return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
						setServerResponse(
							API_STATUS_CODE.UNAUTHORIZED,
							'invalid_token'
						)
					);
				}

				const { id, employee_id, designation_id, designation, depot_id, depot_name, module_id, module_name } = user;

				const isUserExist = await checkUserId(id, employee_id, designation_id, depot_id, module_id);
				if (isUserExist) {
					req.auth = {
						id,
						employee_id,
						designation_id,
						designation,
						depot_id,
						depot_name,
						module_id,
						module_name
					};
					// console.warn('next:', user);

					next();
				} else {
					return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
						setServerResponse(
							API_STATUS_CODE.UNAUTHORIZED,
							'invalid_user'
						)
					);
				}
			});
		} catch (error) {
			return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
				setServerResponse(
					API_STATUS_CODE.UNAUTHORIZED,
					'invalid_user'
				)
			);
		}
	};
}
module.exports = {
	authenticateToken
};
