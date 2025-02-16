/**
 * @author Md Majedul Islam 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const jwt = require('jsonwebtoken');
const { pool } = require('../../_DB/db');
const { setServerResponse } = require('../../utilities/server-response');
const { API_STATUS_CODE } = require('../../consts/error-status');

const checkUserId = async (email, role) => {
	const query = `
  	SELECT
		*
	FROM
		user
	WHERE
		email = ? AND
		role = ? AND
		is_user_active = ${1};
  	`;

	const values = [
		email,
		role
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
			message: 'unauthorized-user'
		})
	} else {
		try {
			let token = authHeader.replace(/^[B|b]earer\s+/, '');

			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
				if (err) {
					return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
						setServerResponse(
							API_STATUS_CODE.UNAUTHORIZED,
							'Invalid token'
						)
					);
				}

				const { id, email, role } = user;

				const isUserExist = await checkUserId(email, role);
				if (isUserExist) {
					req.auth = {
						id,
						email,
						role,
					};
					next();
				} else {
					return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
						setServerResponse(
							API_STATUS_CODE.UNAUTHORIZED,
							'Invalid user'
						)
					);
				}
			});
		} catch (error) {
			return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
				setServerResponse(
					API_STATUS_CODE.UNAUTHORIZED,
					'Invalid user'
				)
			);
		}
	};
}
module.exports = {
	authenticateToken
};
