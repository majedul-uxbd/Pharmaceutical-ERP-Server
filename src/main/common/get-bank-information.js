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

const { TABLE_DEPARTMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-department-column-name");
const { TABLE_DESIGNATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-designation-column-name");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");


const getEmployeeInformationQuery = async (employeeId) => {
    const _query = `
        SELECT
            ${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.FULL_NAME},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.JOINING_DATE},
            designation.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.DEPARTMENT_ID},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.POSTING_PLACE}
        FROM
            ${TABLES.TBL_EMPLOYEES} AS employee
        LEFT JOIN
            ${TABLES.TBL_DESIGNATION} AS designation
        ON 
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID} = designation.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_ID}
        LEFT JOIN
            ${TABLES.TBL_DEPARTMENT} AS department
        ON 
            employee.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPARTMENT_ID} = department.${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID}
    `;
}


/**
 * @param {string} employeeId 
 * @description This function will return employee information
 */
const bankInformation = async (employeeId) => {
    try {
        const employeeData = await getEmployeeInformationQuery();
    } catch (error) {

    }
}

module.exports = {
    bankInformation
}