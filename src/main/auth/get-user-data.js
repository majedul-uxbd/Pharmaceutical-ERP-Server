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

const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getUserDataQuery = async (authData) => {
    const query = `
    SELECT
        id,
        f_name,
        l_name,
        contact_no,
        address,
        email,
        role,
        profile_img
    FROM
        user
    WHERE
        id = ? AND
        email = ? AND
        role = ? AND
        is_user_active = ${1};
    `;

    const values = [
        authData.id,
        authData.email,
        authData.role
    ]

    try {
        const [result] = await pool.query(query, values);
        if (result.length > 0) {
            return result[0];
        }
        return false;
    } catch (error) {
        return error
    }
}

/**
 * @param {Object} authData - An object containing the authentication details of the user.
 * @param {number} authData.id - The unique ID of the user.
 * @param {string} authData.email - The email address of the user.
 * @param {string} authData.role - The role of the user (e.g., 'admin', 'user').
 */
const getUserData = async (authData) => {
    try {
        const userData = await getUserDataQuery(authData);
        if (!userData) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'User not found'
                )
            );
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'Get data successfully',
                userData
            )
        );
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'Internal Server Error'
            )
        );
    }
}


module.exports = {
    getUserData
}