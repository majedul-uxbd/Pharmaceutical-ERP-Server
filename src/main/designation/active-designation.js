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
const { format } = require('date-fns');
const { TABLE_DESIGNATION_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-designation-column-name');
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');

const isDesignationStatusActive = async (id) => {
    const _query = `
        SELECT
            ${TABLE_DESIGNATION_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_DESIGNATION}
        WHERE
            ${TABLE_DESIGNATION_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].active_status === 1) {
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


const activeDesignationStatus = async (id, authData, modifiedAt) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_DESIGNATION}
        SET
            ${TABLE_DESIGNATION_COLUMNS_NAME.ACTIVE_STATUS} = ${1},
            ${TABLE_DESIGNATION_COLUMNS_NAME.MODIFIED_BY} = ?,
            ${TABLE_DESIGNATION_COLUMNS_NAME.MODIFIED_AT} = ?
        WHERE
            ${TABLE_DESIGNATION_COLUMNS_NAME.ID} = ?;
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
 * 
 * @param {number} id 
 * @param {{
 * employee_id: string,
 * }} authData 
 * @description This function is used to active designation
 * @returns 
 */
const activeDesignation = async (id, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'designation_id_is_required'
            )
        )
    };
    try {
        const isActive = await isDesignationStatusActive(id);
        if (isActive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'designation_is_not_found'
                )
            )
        }
        if (isActive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'designation_is_already_active'
                )
            )
        }

        const isUpdated = await activeDesignationStatus(id, authData, modifiedAt);
        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'designation_is_activated_successfully'
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
    activeDesignation
}