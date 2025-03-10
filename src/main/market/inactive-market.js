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
const { setServerResponse } = require("../../utilities/server-response")

const isMarketAlreadyInactivated = async (id) => {
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

const inactiveMarketStatusQuery = async (id) => {
    const _query = `
        UPDATE
            market
        SET
            market_status = ${0}
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
 * @description This function is used to inactive market
 * @returns 
 */
const inactiveMarket = async (id) => {
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
        const inactiveStatus = await inactiveMarketStatusQuery(id);

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