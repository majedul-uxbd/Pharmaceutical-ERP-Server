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
const { TABLE_REGION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-region-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { TABLE_MARKET_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-market-column-name");


const isRegionExistQuery = async (marketData) => {
    const _query = `
        SELECT
            ${TABLE_REGION_COLUMNS_NAME.REGION_ID}
        FROM 
            ${TABLES.TBL_REGION}
        WHERE
            ${TABLE_REGION_COLUMNS_NAME.REGION_ID} = ?;
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
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_NAME}
        FROM 
            ${TABLES.TBL_MARKET}
        WHERE
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_NAME} = ? OR 
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_CODE} = ? OR 
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_ID} = ?;
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

const addMarketDataQuery = async (marketData, authData) => {
    const _query = `
        INSERT INTO
            market
            (
                ${TABLE_MARKET_COLUMNS_NAME.MARKET_ID},
                ${TABLE_MARKET_COLUMNS_NAME.MARKET_CODE},
                ${TABLE_MARKET_COLUMNS_NAME.MARKET_NAME}, 
                ${TABLE_MARKET_COLUMNS_NAME.CREATED_BY},
                ${TABLE_MARKET_COLUMNS_NAME.REGION_ID},
                ${TABLE_MARKET_COLUMNS_NAME.COMMENT}
            )
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const _values = [
        marketData.market_id,
        marketData.market_code,
        marketData.market_name,
        authData.employee_id,
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
 * Creates a new market entry in the database after validating region existence and market uniqueness.
 * Returns a server response indicating the result (success, already exists, region not found, or error).
 *
 * @param {{
 *   market_id: string,
 *   market_code: string,
 *   market_name: string,
 *   region_id: string,
 *   comment: string
 * }} marketData - The market details to be added.
 * @param {{ employee_id: string }} authData - Authenticated user data, must include employee_id of the creator.
 * @returns {Promise<Object>} - Rejects with a server response object indicating the result (success, error, or conflict).
 */
const addMarketData = async (marketData, authData) => {
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
        const isAdded = await addMarketDataQuery(marketData, authData);
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