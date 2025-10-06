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
const { TABLE_REGION_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-region-column-name');
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');
const { format } = require('date-fns');

const isRegionAlreadyInactivated = async (id) => {
    const _query = `
        SELECT
            ${TABLE_REGION_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_REGION}
        WHERE
            ${TABLE_REGION_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].region_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const inactiveRegionStatusQuery = async (id, authData, modifiedAt) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_REGION}
        SET
            ${TABLE_REGION_COLUMNS_NAME.ACTIVE_STATUS} = ${0},
            ${TABLE_REGION_COLUMNS_NAME.MODIFIED_BY} = ?,
            ${TABLE_REGION_COLUMNS_NAME.MODIFIED_AT} = ?
        WHERE
            ${TABLE_REGION_COLUMNS_NAME.ID} = ?;
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
 * Inactivates a region by its ID if it is not already inactive.
 * Updates the region's status, modified by, and modified at fields.
 * Returns a server response indicating the result (success, already inactive, not found, or error).
 *
 * @param {number} id - The unique identifier of the region to inactivate.
 * @param {{ employee_id: string }} authData - Authenticated user data, must include employee_id of the modifier.
 * @returns {Promise<Object>} - Resolves with a server response object on success, rejects with a server response object on error or invalid state.
 */
const inactiveRegion = async (id, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'region_id_is_required'
            )
        )
    }
    try {
        const isAlreadyInactivated = await isRegionAlreadyInactivated(id);
        if (isAlreadyInactivated === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'region_is_not_found'
                )
            )
        }
        if (isAlreadyInactivated === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'region_is_already_inactivate'
                )
            )
        }
        const inactiveStatus = await inactiveRegionStatusQuery(id, authData, modifiedAt);

        if (inactiveStatus === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'region_is_inactivated_successfully'
                )
            )
        }
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    inactiveRegion
}