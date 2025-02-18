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
        e.id,
        e.employee_id,
        e.full_name,
        e.username,
        e.email,
        e.contact,
        e.present_address,
        e.permanent_address,
        e.joining_date,
        e.posting_place,
        e.permanent_date,
        e.nid_no,
        e.department_id,
        dept.department_name,
        e.depot_id,
        df.depot_name,
        e.module_id,
        mf.module_name,
        e.designation_id,
        d.designation_name,
        e.profile_pic
    FROM
        employees AS e
    LEFT JOIN department AS dept
    ON
        e.department_id = dept.department_id
    LEFT JOIN designation AS d
    ON
        e.designation_id = d.designation_id
    LEFT JOIN depot_info AS df
    ON
        e.depot_id = df.depot_id
    LEFT JOIN module_info AS mf
    ON
        e.module_id = mf.module_id
    WHERE
        e.employee_id = ? AND
        e.designation_id = ? AND
        e.depot_id = ?;
    `;

    const values = [
        authData.employee_id,
        authData.designation_id,
        authData.depot_id
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
                    'user_not_found'
                )
            );
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                userData
            )
        );
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getUserData
}