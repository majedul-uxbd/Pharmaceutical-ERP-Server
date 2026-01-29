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

const { pool } = require("../../_DB/db");
const { TABLE_DEPARTMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-department-column-name");
const { TABLE_DESIGNATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-designation-column-name");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLE_POSTING_PLACE_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-posting-place-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getEmployeeListQuery = async (employeeId) => {
    const _query = `
        SELECT
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID},
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.FULL_NAME},
            posting_place.${TABLE_POSTING_PLACE_COLUMNS_NAME.PLACE_NAME},
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.JOINING_DATE},
            designation.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME},
            department.${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME}
        FROM
            ${TABLES.TBL_EMPLOYEES} AS employee
        LEFT JOIN
            ${TABLES.TBL_POSTING_INFO} AS posting_place
        ON
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.POSTING_PLACE} = posting_place.${TABLE_POSTING_PLACE_COLUMNS_NAME.PLACE_ID}
        LEFT JOIN
            ${TABLES.TBL_DESIGNATION} AS designation
        ON
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID} = designation.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_ID}
        LEFT JOIN
            ${TABLES.TBL_DEPARTMENT} AS department
        ON
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPARTMENT_ID} = department.${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID}
        WHERE
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID} = ? AND
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS} = 1;
    `;
    try {
        const [result] = await pool.query(_query, [employeeId]);
        return Promise.resolve(result[0]);
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @param {string} employeeId 
 * @description This function will return employee list data
 */
const employeeListData = async (employeeId) => {
    try {
        const employeeList = await getEmployeeListQuery(employeeId);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                employeeList
            )
        );
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    employeeListData
}