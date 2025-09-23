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
const { TABLE_MARKET_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-market-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getMarketDataQuery = async () => {
    const query = `
        SELECT
            ${TABLE_MARKET_COLUMNS_NAME.ID},
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_ID},
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_NAME}
        FROM
            ${TABLES.TBL_MARKET}
        WHERE
            ${TABLE_MARKET_COLUMNS_NAME.ACTIVE_STATUS} = ${1};
    `;
    try {
        const [result] = await pool.query(query);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * @description This function is used to get market information from the database
 */
const getMarketData = async () => {
    try {
        const zoneData = await getMarketDataQuery();

        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                zoneData
            )
        );
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error"
            )
        );
    }
}

module.exports = {
    getMarketData
}