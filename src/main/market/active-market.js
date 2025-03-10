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

const isMarketStatusActive = async (id) => {
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


const activeMarketStatus = async (id) => {
    const _query = `
        UPDATE
            market
        SET
            market_status = ${1}
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
 * @description This function is used to active market
 * @returns 
 */
const activeMarket = async (id) => {
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

        const isUpdated = await activeMarketStatus(id);
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