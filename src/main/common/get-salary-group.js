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

const { TABLE_SALARY_GROUP_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-salary-group-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const salaryGroupInformationQuery = async () => {
    const query = `
        SELECT
            ${TABLE_SALARY_GROUP_COLUMNS_NAME.ID},
            ${TABLE_SALARY_GROUP_COLUMNS_NAME.GROUP_ID},
            ${TABLE_SALARY_GROUP_COLUMNS_NAME.NAME}
        FROM
            ${TABLES.TBL_SALARY_GROUP};
    `;
    try {
        const [result] = await pool.query(query);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * @description This function is used to get salary group information from the database
 */
const salaryGroupInformation = async () => {
    try {
        const salaryGroupData = await salaryGroupInformationQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                salaryGroupData
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
    salaryGroupInformation
}
