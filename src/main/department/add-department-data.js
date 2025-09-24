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
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { TABLE_DEPARTMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-department-column-name");

const isDepartmentNameAlreadyExist = async (departmentData) => {
    const _query = `
        SELECT
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME}
        FROM 
            ${TABLES.TBL_DEPARTMENT}
        WHERE
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID} = ? OR 
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_CODE} = ? OR
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME} = ?;
    `;
    const _values = [
        departmentData.department_id,
        departmentData.department_code,
        departmentData.department_name
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

const addDepartmentDataQuery = async (authData, departmentData) => {
    const _query = `
        INSERT INTO
            ${TABLES.TBL_DEPARTMENT}
            (
                ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID},
                ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_CODE},
                ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME},
                ${TABLE_DEPARTMENT_COLUMNS_NAME.COMMENT},
                ${TABLE_DEPARTMENT_COLUMNS_NAME.CREATED_BY}
            )
        VALUES (?, ?, ?, ?, ?);
    `;
    const _values = [
        departmentData.department_id,
        departmentData.department_code,
        departmentData.department_name,
        departmentData.comment,
        authData.employee_id
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * employee_id: string,
 * }} authData 
 * @param {{
 * department_id:string,
 * department_code:string,
 * department_name:string,
 * comment:string
 * }} departmentData 
 * @description This function is used to create a new department
 */
const addDepartmentData = async (authData, departmentData) => {
    try {
        const isExist = await isDepartmentNameAlreadyExist(departmentData);
        if (isExist === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'department_data_already_exists'
                )
            )
        }
        const isAdded = await addDepartmentDataQuery(authData, departmentData);
        if (isAdded === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'department_is_created_successfully'
                )
            )
        }
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
    addDepartmentData
}