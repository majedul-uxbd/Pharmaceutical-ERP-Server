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
const { TABLE_POSTING_PLACE_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-posting-place-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getPostingDataQuery = async () => {
    const query = `
        SELECT
            ${TABLE_POSTING_PLACE_COLUMNS_NAME.ID},
            ${TABLE_POSTING_PLACE_COLUMNS_NAME.PLACE_ID},
            ${TABLE_POSTING_PLACE_COLUMNS_NAME.PLACE_NAME}
        FROM
            ${TABLES.TBL_POSTING_INFO}
        WHERE
            ${TABLE_POSTING_PLACE_COLUMNS_NAME.ACTIVE_STATUS} = ${1};
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
 * @description This function is used to get posting information from the database
 */
const getPostingData = async () => {
    try {
        const postingData = await getPostingDataQuery();

        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                postingData
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
    getPostingData
}