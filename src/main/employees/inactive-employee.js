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
const { setServerResponse } = require("../../utilities/server-response");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-employee-column-name');
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');
const { format } = require('date-fns');

const isEmployeesAlreadyInactivated = async (id) => {
    const _query = `
        SELECT
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_EMPLOYEES}
        WHERE
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].employees_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const inactiveEmployeesStatusQuery = async (id, authData, modifiedAt) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_EMPLOYEES}
        SET
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS} = ${0},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.MODIFIED_BY} = ?,
            ${TABLE_EMPLOYEES_COLUMNS_NAME.MODIFIED_AT} = ?
        WHERE
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ID} = ?;
    `;
    const _values = [
        authData.employee_id,
        modifiedAt,
        id
    ];
    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * Inactivates a employee by his ID if he is not already inactive.
 *
 * @param {number} id - The unique identifier of the employee to inactivate.
 * @param {{ employee_id: string }} authData - Authenticated user data, must include employee_id of the modifier.
 * @returns {Promise<Object>} - Resolves with a server response object on success, rejects with a server response object on error or invalid state.
 */
const inactiveEmployees = async (id, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'employee_id_is_required'
            )
        )
    }
    try {
        const isAlreadyInactivated = await isEmployeesAlreadyInactivated(id);
        if (isAlreadyInactivated === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'employee _is_not_found'
                )
            )
        }
        if (isAlreadyInactivated === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'employee_is_already_inactivate'
                )
            )
        }
        const inactiveStatus = await inactiveEmployeesStatusQuery(id, authData, modifiedAt);

        if (inactiveStatus === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'employee_is_inactivated_successfully'
                )
            )
        }
    } catch (error) {
        console.warn('🚀 ~ inactiveEmployees ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    inactiveEmployees
}