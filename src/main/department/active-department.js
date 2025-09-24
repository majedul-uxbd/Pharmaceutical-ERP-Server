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
const { TABLE_DEPARTMENT_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-department-column-name');
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');
const { format } = require('date-fns');

const isDepartmentStatusActive = async (id) => {
    const _query = `
        SELECT
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_DEPARTMENT} 
        WHERE
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].department_status === 1) {
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


const activeDepartmentStatus = async (id, authData, modifiedAt) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_DEPARTMENT} 
        SET
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ACTIVE_STATUS} = ${1},
            ${TABLE_DEPARTMENT_COLUMNS_NAME.MODIFIED_BY} = ?,
            ${TABLE_DEPARTMENT_COLUMNS_NAME.MODIFIED_AT} = ?
        WHERE
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [authData.employee_id, modifiedAt, id]);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @param {number} id 
 * @param {{
 * employee_id: string,
 * }} authData 
 * @description This function is used to active department
 */
const activeDepartment = async (id, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'department_id_is_required'
            )
        )
    };
    try {
        const isActive = await isDepartmentStatusActive(id);
        if (isActive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'department_is_not_found'
                )
            )
        }
        if (isActive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'department_is_already_active'
                )
            )
        }

        const isUpdated = await activeDepartmentStatus(id, authData, modifiedAt);
        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'department_is_activated_successfully'
                )
            )
        }
    } catch (error) {
        // console.log('🚀 ~ activeDepartment ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    activeDepartment
}