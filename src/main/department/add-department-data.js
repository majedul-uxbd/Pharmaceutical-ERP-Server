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

const { reject } = require("lodash");
const { pool } = require("../../_DB/db");
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");

const isDepartmentNameAlreadyExist = async (departmentData) => {
    const _query = `
        SELECT
            department_name
        FROM 
            department
        WHERE
            department_name = ? OR department_id = ?;
    `;
    const _values = [
        departmentData.department_name,
        departmentData.department_id,
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise / reject(error);
    }
}

const addDepartmentDataQuery = async (authData, departmentData) => {
    const _query = `
        INSERT INTO
            department
            (
                department_id,
                department_name,
                comment,
                created_by
            )
        VALUES (?, ?, ?, ?);
    `;
    const _values = [
        departmentData.department_id,
        departmentData.department_name,
        departmentData.comment,
        authData.employee_id
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        // console.warn('🚀 ~ addDepartmentDataQuery ~ error:', error);
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * id: number,
 * employee_id: string,
 * designation_id: string,
 * designation: string,
 * depot_id: string,
 * depot_name: string,
 * module_id: string,
 * module_name: string
 * }} authData 
 * @param {{
 * department_id:string,
 * department_name:string,
 * comment:string
 * }} departmentData 
 * @description This function is used to create a new department
 * @returns 
 */
const addDepartmentData = async (authData, departmentData) => {
    try {
        const isExist = await isDepartmentNameAlreadyExist(departmentData);
        if (isExist === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'department_name_already_exists'
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
        // console.warn('🚀 ~ addDepartmentData ~ error:', error);
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