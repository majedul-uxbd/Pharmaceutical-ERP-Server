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
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getDepotDataQuery = async () => {
    const query = `
        SELECT DISTINCT
            ${TABLE_DEPOT_INFO_COLUMNS_NAME.ID},
            ${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_ID},
            ${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_NAME}
        FROM
            ${TABLES.TBL_DEPORT_INFO}
        WHERE
            ${TABLE_DEPOT_INFO_COLUMNS_NAME.ACTIVE_STATUS} = ${1};
    `;
    try {
        const [result] = await pool.query(query);
        return result;
    } catch (error) {
        // console.log("🚀 ~ userLoginQuery ~ error:", error)
        return Promise.reject(error);
    }
}


/**
 * @description This function is used to get depot information from the database
 */
const getDepotData = async () => {
    try {
        const depotData = await getDepotDataQuery();

        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                depotData
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
    getDepotData
}