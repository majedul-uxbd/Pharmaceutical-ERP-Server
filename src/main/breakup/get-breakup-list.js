/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const { TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-salary-breakup-element-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getBreakupListQuery = async () => {
    const _query = `
        SELECT
            ${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.ID},
            ${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.BREAKUP_ID},
            ${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.BREAKUP_NAME}
        FROM
            ${TABLES.TBL_SALARY_BREAKUP_ELEMENT}
        ORDER BY
            ${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.ID} ASC
    `;

    try {
        const [result] = await pool.query(_query);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * @description This function is used to get breakup list
 * @returns {Promise<Object>} If successful, returns a server response object with breakup list
 */
const getBreakupList = async () => {
    try {
        const breakupList = await getBreakupListQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                breakupList
            )
        );
    } catch (error) {
        console.log("🚀 ~ getBreakupList ~ error:", error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    getBreakupList
}
