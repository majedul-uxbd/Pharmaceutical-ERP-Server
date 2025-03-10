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
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        market;
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getMarketDataQuery = async (paginationData) => {
    const query = `
        SELECT
            mk.id,
            mk.market_id,
            mk.market_code,
            mk.market_name,
            mk.comment,
            mk.market_status,
            region.region_name,
            mk.created_at,
            mk.modified_at
        FROM
            market AS mk
        LEFT JOIN region
        ON
            mk.region_id = region.region_id
        ORDER BY
            mk.id
        DESC
        LIMIT ? OFFSET ?;
    `;

    const values = [
        paginationData.itemsPerPage,
        paginationData.offset,
    ]

    try {
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        return error
    }
}

/**
 * @param {Object} paginationData - An object containing the pagination details.
 * @description This function will return the market Information
 * @returns
 */
const getMarketData = async (paginationData) => {
    let totalRows;
    try {
        totalRows = await getNumberOfRowsQuery();
        const regionData = await getMarketDataQuery(paginationData);
        const result = {
            metadata: {
                totalRows: totalRows,
            },
            data: regionData,
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                result
            )
        );
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getMarketData
}