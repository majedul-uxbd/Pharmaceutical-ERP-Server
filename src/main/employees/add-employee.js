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
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const checkIsDataAlreadyExist = async (employeeData) => {
    const _query = `
        SELECT
            ${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        FROM 
            ${TABLES.TBL_EMPLOYEES}
        WHERE
            ${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID} = ? OR
            ${TABLE_EMPLOYEES_COLUMNS_NAME.USERNAME} = ? OR
            ${TABLE_EMPLOYEES_COLUMNS_NAME.EMAIL} = ?;
    `;

    const _values = [
        employeeData.employee_id,
        employeeData.username,
        employeeData.email
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const insertEmployeeData = async (authData, employeeData) => {
    const _query = `
        INSERT  INTO
            ${TABLES.TBL_EMPLOYEES}
        (
            ${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.USERNAME},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.EMAIL},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.CONTACT},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.PRESENT_ADDRESS},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.PERMANENT_ADDRESS},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.JOINING_DATE},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.POSTING_PLACE},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.PERMANENT_DATE},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.MODULE_ID},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.DEPORT_ID},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.NID_NO},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.CREATED_BY},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID},
            ${TABLE_EMPLOYEES_COLUMNS_NAME.DEPARTMENT_ID}
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const _values = [
        employeeData.employee_id,
        employeeData.full_name,
        employeeData.username,
        employeeData.email,
        employeeData.contact,
        employeeData.present_address,
        employeeData.permanent_address,
        employeeData.joining_date,
        employeeData.posting_place,
        employeeData.permanent_date,
        employeeData.module_id,
        employeeData.depot_id,
        employeeData.nid_no,
        authData.employee_id,
        employeeData.designation_id,
        employeeData.department_id
    ];
    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows === 1) {
            return true;
        } return false;
    } catch (error) {
        // console.warn('🚀 ~ insertEmployeeData ~ error:', error);
        return Promise.reject(error);
    }
};

/**
 * @param {{ employee_id: string }} authData - Authenticated user data, must include employee_id of the creator.
 * @param {{
 *   employee_id: string,
 *   full_name: string,
 *   username: string,
 *   email: string,
 *   contact: string,
 *   present_address: string,
 *   permanent_address: string,
 *   joining_date: string,
 *   posting_place: string,
 *   permanent_date: string,
 *   module_id: string,
 *   depot_id: string,
 *   nid_no: string,
 *   designation_id: string,
 *   department_id: string
 * }} employeeData - Employee details to be added.
 * @description Adds a new employee to the database after checking for duplicate employee ID or username or email.
 * Returns a server response indicating success or error status.
 * @returns {Promise<Object>} - Resolves with a server response object on error, rejects with a server response object on success.
 */
const addEmployee = async (authData, employeeData) => {
    try {
        const isExist = await checkIsDataAlreadyExist(employeeData);
        if (isExist) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "employee_already_exist"
                )
            )
        }
        const isInsert = await insertEmployeeData(authData, employeeData);
        if (isInsert) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    "employee_is_created_successfully"
                )
            )
        }
    } catch (error) {
        console.log('🚀 ---------------------------------------🚀');
        console.log('🚀 ~ :144 ~ addEmployee ~ error:', error);
        console.log('🚀 ---------------------------------------🚀');
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    addEmployee
}