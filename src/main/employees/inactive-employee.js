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

const isEmployeesAlreadyInactivated = async (id) => {
    const _query = `
        SELECT
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_EMPLOYEES}
        WHERE
            ${TABLE_EMPLOYEES_COLUMNS_NAME.Id} = ?;
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

const inactiveEmployeesStatusQuery = async (id) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_EMPLOYEES}
        SET
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS} = ${0}
        WHERE
            ${TABLE_EMPLOYEES_COLUMNS_NAME.ID} = ?;
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
 * @description This function is used to inactive employees
 * @returns 
 */
const inactiveEmployees = async (id) => {
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
        const inactiveStatus = await inactiveEmployeesStatusQuery(id);

        if (inactiveStatus === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'employee_is_inactivated_successfully'
                )
            )
        }
    } catch (error) {
        // console.warn('🚀 ~ inactiveEmployees ~ error:', error);
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