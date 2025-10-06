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
const { TABLE_DEPOT_INFO_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-depot-info-column-name");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLE_ZONE_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-zone-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        ${TABLES.TBL_ZONE};
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getZoneDataQuery = async (paginationData) => {
    const query = `
        SELECT DISTINCT
            zone.${TABLE_ZONE_COLUMNS_NAME.ID},
            zone.${TABLE_ZONE_COLUMNS_NAME.ZONE_ID},
            zone.${TABLE_ZONE_COLUMNS_NAME.ZONE_CODE},
            zone.${TABLE_ZONE_COLUMNS_NAME.ZONE_NAME},
            zone.${TABLE_ZONE_COLUMNS_NAME.COMMENT},
            zone.${TABLE_ZONE_COLUMNS_NAME.ACTIVE_STATUS},
            zone.${TABLE_ZONE_COLUMNS_NAME.CREATED_AT},
            zone.${TABLE_ZONE_COLUMNS_NAME.MODIFIED_AT},
            created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS created_by,
            modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS modified_by,
            depot.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_NAME}
        FROM
            ${TABLES.TBL_ZONE} AS zone
        LEFT JOIN ${TABLES.TBL_DEPORT_INFO} AS depot
        ON
            zone.${TABLE_ZONE_COLUMNS_NAME.DEPOT_ID} = depot.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS created_by
        ON
            zone.${TABLE_ZONE_COLUMNS_NAME.CREATED_BY} = created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS modified_by
        ON
            zone.${TABLE_ZONE_COLUMNS_NAME.MODIFIED_BY} = modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        ORDER BY
            zone.${TABLE_ZONE_COLUMNS_NAME.ID}
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
 * @description This function will return the zone Information
 * @returns
 */
const getZoneData = async (paginationData) => {
    let totalRows;
    try {
        totalRows = await getNumberOfRowsQuery();
        const zoneData = await getZoneDataQuery(paginationData);
        const result = {
            metadata: {
                totalRows: totalRows,
            },
            data: zoneData,
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                result
            )
        );
    } catch (error) {
        // console.log('🚀 ~ file: get-donation-data.js:188 ~ getZoneData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getZoneData
}