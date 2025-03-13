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
const { format } = require('date-fns');
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status")
const { setServerResponse } = require("../../utilities/server-response")

const isMarketInactiveQuery = async (id) => {
    const _query = `
        SELECT
            market_status
        FROM
            market
        WHERE
            id = ?;
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

const updateMarketDataQuery = async (marketData) => {
    const _query = `
        UPDATE
            market
        SET
            region_id = ?,
            market_name = ?,
            comment = ?,
            modified_at = ?
        WHERE
            id = ?;
    `;
    const _values = [
        marketData.region_id,
        marketData.market_name,
        marketData.comment,
        marketData.modifiedAt,
        marketData.id
    ]
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
 * @param {{
 * id: string,
 * market_name:string,
 * region_id:string,
 * comment:string
 * }} marketData 
 * @description This function is used to update market data
 * @returns 
 */
const updateMarketData = async (marketData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    marketData = { ...marketData, modifiedAt: modifiedAt };

    try {
        const isInactive = await isMarketInactiveQuery(marketData.id);
        if (isInactive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'market_is_not_found'
                )
            )
        }
        if (isInactive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'inactive_market_can_not_be_updated'
                )
            )
        }
        const isUpdated = await updateMarketDataQuery(marketData);

        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'market_data_is_updated_successfully'
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
    updateMarketData
}