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
        zone;
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
        SELECT
            z.id,
            z.zone_id,
            z.zone_code,
            z.zone_name,
            z.comment,
            z.zone_status,
            di.depot_name,
            z.created_at,
            z.modified_at
        FROM
            zone AS z
        LEFT JOIN depot_info AS di
        ON
            z.depot_id = di.depot_id
        ORDER BY
            z.id
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