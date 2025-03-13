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

const { pool } = require("../../_DB/db");
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");


const isRegionExistQuery = async (marketData) => {
    const _query = `
        SELECT
            region_id
        FROM 
            region
        WHERE
            region_id = ?;
    `;
    const _values = [
        marketData.region_id,
    ]
    try {
        const [result] = await pool.query(_query, _values);

        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const isMarketNameAlreadyExist = async (marketData) => {
    const _query = `
        SELECT
            market_name
        FROM 
            market
        WHERE
            market_name = ? OR market_code = ? OR market_id = ?;
    `;
    const _values = [
        marketData.market_name,
        marketData.market_code,
        marketData.market_id
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const addMarketDataQuery = async (marketData) => {
    const _query = `
        INSERT INTO
            market
            (
                market_id,
                market_code,
                market_name,
                region_id,
                comment
            )
        VALUES (?, ?, ?, ?, ?);
    `;
    const _values = [
        marketData.market_id,
        marketData.market_code,
        marketData.market_name,
        marketData.region_id,
        marketData.comment,
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        // console.warn('🚀 ~ addMarketDataQuery ~ error:', error);
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * market_id:string,
 * market_code:string,
 * market_name:string,
 * region_id:string,
 * comment:string
 * }} marketData 
 * @description This function is used to create a new market
 * @returns 
 */
const addMarketData = async (marketData) => {
    try {
        const isRegionExist = await isRegionExistQuery(marketData);
        if (isRegionExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'region_is_not_found'
                )
            )
        }
        const isExist = await isMarketNameAlreadyExist(marketData);

        if (isExist === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'market_name_already_exists'
                )
            )
        }
        const isAdded = await addMarketDataQuery(marketData);
        if (isAdded === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'market_is_created_successfully'
                )
            )
        }
    } catch (error) {
        console.warn('🚀 ~ addMarketData ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    addMarketData
}