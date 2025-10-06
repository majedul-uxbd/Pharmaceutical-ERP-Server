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
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLE_MARKET_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-market-column-name");
const { TABLE_REGION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-region-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        ${TABLES.TBL_MARKET};
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
            market.${TABLE_MARKET_COLUMNS_NAME.ID},
            market.${TABLE_MARKET_COLUMNS_NAME.MARKET_ID},
            market.${TABLE_MARKET_COLUMNS_NAME.MARKET_CODE},
            market.${TABLE_MARKET_COLUMNS_NAME.MARKET_NAME},
            market.${TABLE_MARKET_COLUMNS_NAME.COMMENT},
            market.${TABLE_MARKET_COLUMNS_NAME.ACTIVE_STATUS},
            market.${TABLE_MARKET_COLUMNS_NAME.CREATED_AT},
            market.${TABLE_MARKET_COLUMNS_NAME.MODIFIED_AT},
            created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS created_by,
            modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS modified_by,
            region.${TABLE_REGION_COLUMNS_NAME.REGION_NAME}
        FROM
            ${TABLES.TBL_MARKET} AS market
        LEFT JOIN 
            ${TABLES.TBL_REGION} AS region
        ON
            market.${TABLE_MARKET_COLUMNS_NAME.REGION_ID} = region.${TABLE_REGION_COLUMNS_NAME.REGION_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS created_by
        ON
            market.${TABLE_MARKET_COLUMNS_NAME.CREATED_BY} = created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS modified_by
        ON
            market.${TABLE_MARKET_COLUMNS_NAME.MODIFIED_BY} = modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        ORDER BY
            market.${TABLE_MARKET_COLUMNS_NAME.ID}
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
 * Retrieves paginated market information from the database, including metadata about total rows.
 * Combines market, region, and employee (created/modified by) data using joins.
 * Returns a server response with the data or an error response if the operation fails.
 *
 * @param {{ itemsPerPage: number, offset: number }} paginationData - Pagination details: items per page and offset.
 * @returns {Promise<Object>} - Resolves with a server response object containing market data and metadata, or an error response on failure.
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