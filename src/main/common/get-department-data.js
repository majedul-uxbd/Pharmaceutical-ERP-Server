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
const { TABLE_DEPARTMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-department-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getDepartmentDataQuery = async () => {
    const query = `
        SELECT
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ID},
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID},
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME}
        FROM
            ${TABLES.TBL_DEPARTMENT}
        WHERE
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ACTIVE_STATUS} = ${1};
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
 * @description This function is used to get department information from the database
 */
const getDepartmentData = async () => {
    try {
        const departmentData = await getDepartmentDataQuery();

        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                departmentData
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
    getDepartmentData
}