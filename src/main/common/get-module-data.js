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
const { TABLE_MODULE_INFORMATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-module-information-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getModuleDataQuery = async () => {
    const query = `
        SELECT
            ${TABLE_MODULE_INFORMATION_COLUMNS_NAME.ID},
            ${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_ID},
            ${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_NAME},
            ${TABLE_MODULE_INFORMATION_COLUMNS_NAME.DESCRIPTION},
            ${TABLE_MODULE_INFORMATION_COLUMNS_NAME.CREATED_AT}
        FROM
            ${TABLES.TBL_MODULE_INFO}
        WHERE
            ${TABLE_MODULE_INFORMATION_COLUMNS_NAME.ACTIVE_STATUS} = ${1};
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
 * @description This function is used to get module information from the database
 */
const getModuleData = async () => {
    try {
        const moduleData = await getModuleDataQuery();

        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                moduleData
            )
        );
    } catch (error) {
        // console.warn('🚀 ~ getModuleData ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error"
            )
        );
    }
}

module.exports = {
    getModuleData
}