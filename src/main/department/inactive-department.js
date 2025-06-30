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

const _ = require('lodash');
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status")
const { setServerResponse } = require("../../utilities/server-response")

const isDepartmentAlreadyInactivated = async (id) => {
    const _query = `
        SELECT
            department_status
        FROM
            department
        WHERE
            id = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].department_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const inactiveDepartmentStatusQuery = async (id) => {
    const _query = `
        UPDATE
            department
        SET
            department_status = ${0}
        WHERE
            id = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {number} id 
 * @description This function is used to inactive department
 * @returns 
 */
const inactiveDepartment = async (id) => {
    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'department_id_is_required'
            )
        )
    }
    try {
        const isAlreadyInactivated = await isDepartmentAlreadyInactivated(id);
        if (isAlreadyInactivated === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'department_is_not_found'
                )
            )
        }
        if (isAlreadyInactivated === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'department_is_already_inactivate'
                )
            )
        }
        const inactiveStatus = await inactiveDepartmentStatusQuery(id);

        if (inactiveStatus === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'department_is_inactivated_successfully'
                )
            )
        }
    } catch (error) {
        // console.warn('🚀 ~ inactiveDepartment ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    inactiveDepartment
}