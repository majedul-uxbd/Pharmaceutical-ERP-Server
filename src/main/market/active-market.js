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
const { format } = require('date-fns');
const { TABLE_MARKET_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-market-column-name');

const isMarketStatusActive = async (id) => {
    const _query = `
        SELECT
            ${TABLE_MARKET_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_MARKET}
        WHERE
            ${TABLE_MARKET_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].market_status === 1) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}


const activeMarketStatus = async (id, authData, modifiedAt) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_MARKET}
        SET
            ${TABLE_MARKET_COLUMNS_NAME.ACTIVE_STATUS} = ${1},
            ${TABLE_MARKET_COLUMNS_NAME.MODIFIED_BY} = ?,
            ${TABLE_MARKET_COLUMNS_NAME.MODIFIED_AT} = ?
        WHERE
            ${TABLE_MARKET_COLUMNS_NAME.ID} = ?;
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
 * Activates a market by its ID if it is not already active.
 * Updates the market's status, modified by, and modified at fields.
 * Returns a server response indicating the result (success, already active, not found, or error).
 *
 * @param {number} id - The unique identifier of the market to activate.
 * @param {{ employee_id: string }} authData - Authenticated user data, must include employee_id of the modifier.
 * @returns {Promise<Object>} - Resolves with a server response object on success, rejects with a server response object on error or invalid state.
 */
const activeMarket = async (id, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'market_id_is_required'
            )
        )
    };
    try {
        const isActive = await isMarketStatusActive(id);
        if (isActive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'market_is_not_found'
                )
            )
        }
        if (isActive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'market_is_already_active'
                )
            )
        }

        const isUpdated = await activeMarketStatus(id, authData, modifiedAt);
        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'market_is_activated_successfully'
                )
            )
        }
    } catch (error) {
        console.warn('🚀 ~ activeMarket ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    activeMarket
}