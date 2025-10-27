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
const { setServerResponse } = require('../../utilities/server-response');
const { API_STATUS_CODE } = require('../../consts/error-status');
const { pool } = require('../../_DB/db');
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-employee-column-name');
const { format } = require('date-fns');

const isEmployeesStatusActive = async (id) => {
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
            if (result[0].employees_status === 1) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        // console.log('🚀 ~ isDepartmentStatusInactive ~ error:', error);
        return Promise.reject(error);
    }
}


const activeEmployeesStatus = async (id, authData, modifiedAt) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_EMPLOYEES}
        SET
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS} = ${1},
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
 * Activate a employee by his ID if he is not already active.
 *
 * @param {number} id - The unique identifier of the employee to activate.
 * @param {{ employee_id: string }} authData - Authenticated user data, must include employee_id of the modifier.
 * @returns {Promise<Object>} - Resolves with a server response object on success, rejects with a server response object on error or invalid state.
 */
const activeEmployees = async (id, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'employee_id_is_required'
            )
        )
    };
    try {
        const isActive = await isEmployeesStatusActive(id);
        if (isActive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'employee_is_not_found'
                )
            )
        }
        if (isActive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'employee_is_already_active'
                )
            )
        }

        const isUpdated = await activeEmployeesStatus(id, authData, modifiedAt);
        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'employee_is_activated_successfully'
                )
            )
        }
    } catch (error) {
        console.log('🚀 -------------------------------------------🚀');
        console.log('🚀 ~ :109 ~ activeEmployees ~ error:', error);
        console.log('🚀 -------------------------------------------🚀');
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    activeEmployees
}