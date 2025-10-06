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
const { TABLE_REGION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-region-column-name");
const { TABLE_ZONE_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-zone-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        ${TABLES.TBL_REGION};
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getRegionDataQuery = async (paginationData) => {
    const query = `
        SELECT
            region.${TABLE_REGION_COLUMNS_NAME.ID},
            region.${TABLE_REGION_COLUMNS_NAME.REGION_ID},
            region.${TABLE_REGION_COLUMNS_NAME.REGION_CODE},
            region.${TABLE_REGION_COLUMNS_NAME.REGION_NAME},
            region.${TABLE_REGION_COLUMNS_NAME.COMMENT},
            region.${TABLE_REGION_COLUMNS_NAME.ACTIVE_STATUS},
            region.${TABLE_REGION_COLUMNS_NAME.CREATED_AT},
            region.${TABLE_REGION_COLUMNS_NAME.MODIFIED_AT},
            created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS created_by,
            modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS modified_by,
            zone.${TABLE_ZONE_COLUMNS_NAME.ZONE_NAME}
        FROM
            ${TABLES.TBL_REGION} AS region
        LEFT JOIN
            ${TABLES.TBL_ZONE} AS zone
        ON
            region.${TABLE_REGION_COLUMNS_NAME.ZONE_ID} = zone.${TABLE_ZONE_COLUMNS_NAME.ZONE_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS created_by
        ON
            region.${TABLE_REGION_COLUMNS_NAME.CREATED_BY} = created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS modified_by
        ON
            region.${TABLE_REGION_COLUMNS_NAME.MODIFIED_BY} = modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        ORDER BY
            region.${TABLE_REGION_COLUMNS_NAME.ID}
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
 * @description This function will return the region Information
 * @returns
 */
const getRegionData = async (paginationData) => {
    let totalRows;
    try {
        totalRows = await getNumberOfRowsQuery();
        const regionData = await getRegionDataQuery(paginationData);
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
        console.warn('🚀 ~ getRegionData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getRegionData
}