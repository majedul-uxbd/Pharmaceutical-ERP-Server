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
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { TABLE_MARKET_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-market-column-name");

const getMarketIdAndCodeCountQuery = async () => {
    const _query = `
        SELECT 
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_ID}, 
            ${TABLE_MARKET_COLUMNS_NAME.MARKET_CODE}
        FROM 
            ${TABLES.TBL_MARKET}
        ORDER BY 
            CAST(${TABLE_MARKET_COLUMNS_NAME.MARKET_ID} AS UNSIGNED) DESC
        LIMIT 1;
    `;

    try {
        const [result] = await pool.query(_query);
        if (result.length > 0) {
            // Increment market_id by 1
            let marketId = parseInt(result[0].market_id, 10) + 1; // Convert to number, add 1
            marketId = marketId.toString();

            // Increment market_code by 1
            let marketCode = result[0].market_code;
            let codeNumber = parseInt(marketCode.substring(1), 10) + 1; // Extract numeric part, add 1
            marketCode = 'M' + codeNumber.toString().padStart(5, '0'); // Ensure it has 5 digits (e.g., 'M00001')

            return ({ market_id: marketId, market_code: marketCode });
        } else {
            const marketId = '00001';
            const marketCode = 'M00001';

            return ({ market_id: marketId, market_code: marketCode });
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get market id and code count and return
 */
const getMarketIdCount = async () => {
    try {
        const countData = await getMarketIdAndCodeCountQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                countData
            )
        );
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    getMarketIdCount
}