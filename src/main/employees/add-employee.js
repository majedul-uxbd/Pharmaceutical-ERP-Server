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
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const checkIsDataAlreadyExist = async (employeeData) => {
    const _query = `
        SELECT
            employee_id
        FROM 
            employees
        WHERE
            employee_id = ? OR
            email = ?;
    `;

    const _values = [
        employeeData.employee_id,
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
        INSERT
        INTO
            employees
        (
            employee_id,
            full_name,
            email,
            contact,
            present_address,
            permanent_address,
            joining_date,
            posting_place,
            permanent_date,
            module_id,
            depot_id,
            nid_no,
            created_by,
            designation_id,
            department_id
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const _values = [
        employeeData.employee_id,
        employeeData.full_name,
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
 * 
 * @param {{
 * employee_id: string
 * }} authData 
 * @param {{Object}} employeeData 
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