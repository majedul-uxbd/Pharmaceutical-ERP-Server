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
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');
const { TABLE_MARKET_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-market-column-name');
const { format } = require('date-fns');

const isMarketAlreadyInactivated = async (id) => {
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
            if (result[0].market_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const inactiveMarketStatusQuery = async (id, authData, modifiedAt) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_MARKET}
        SET
            ${TABLE_MARKET_COLUMNS_NAME.ACTIVE_STATUS} = ${0},
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
 * 
 * @param {number} id 
 * @description This function is used to inactive market
 * @returns 
 */
const inactiveMarket = async (id, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'market_id_is_required'
            )
        )
    }
    try {
        const isAlreadyInactivated = await isMarketAlreadyInactivated(id);
        if (isAlreadyInactivated === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'market_is_not_found'
                )
            )
        }
        if (isAlreadyInactivated === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'market_is_already_inactivate'
                )
            )
        }
        const inactiveStatus = await inactiveMarketStatusQuery(id, authData, modifiedAt);

        if (inactiveStatus === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'market_is_inactivated_successfully'
                )
            )
        }
    } catch (error) {
        console.warn('🚀 ~ inactiveMarket ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    inactiveMarket
}