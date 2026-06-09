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
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");

const getEmployeeIdAndCodeCountQuery = async () => {
    const _query = `
        SELECT 
            ${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        FROM 
            ${TABLES.TBL_EMPLOYEES}
        ORDER BY 
            CAST(${TABLE_EMPLOYEES_COLUMNS_NAME.ID} AS UNSIGNED) DESC
        LIMIT 5;
    `;

    try {
        const [result] = await pool.query(_query);
        if (result.length > 0) {
            // Increment employee_id by 1
            // let employeeId = parseInt(result[0].employee_id, 10) + 1; // Convert to number, add 1
            // employeeId = employeeId.toString();

            // Increment employee_code by 1
            let employeeId = result[0].employee_id;
            let codeNumber = parseInt(employeeId.substring(1), 10) + 1; // Extract numeric part, add 1
            employeeId = 'E' + codeNumber.toString().padStart(5, '0'); // Ensure it has 5 digits (e.g., 'E00001')

            return ({ employee_id: employeeId });
        } else {
            const employeeId = 'E00001';
            return ({ employee_id: employeeId });
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get employee id and code count and return
 */
const getEmployeeIdCount = async () => {
    try {
        const countData = await getEmployeeIdAndCodeCountQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                countData
            )
        );
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    getEmployeeIdCount
}