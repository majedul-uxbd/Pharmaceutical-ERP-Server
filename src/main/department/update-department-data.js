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

const _ = require('lodash');
const { format } = require('date-fns');
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status")
const { setServerResponse } = require("../../utilities/server-response")

const isDepartmentInactiveQuery = async (id) => {
    const _query = `
        SELECT
            department_status
        FROM
            department
        WHERE
            id = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].department_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const updateDepartmentDataQuery = async (authData, departmentData) => {
    const _query = `
        UPDATE
            department
        SET
            department_id = ?,
            department_name = ?,
            comment = ?,
            modified_by= ?,
            modified_at = ?
        WHERE
            id = ?;
    `;
    const _values = [
        departmentData.department_id,
        departmentData.department_name,
        departmentData.comment,
        authData.employee_id,
        departmentData.modifiedAt,
        departmentData.id
    ]
    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
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
 * id:number,
 * department_id:string,
 * department_name:string,
 * comment:string
 * }} departmentData }
 * @description This function is used to update department data
 * @returns 
 */
const updateDepartmentData = async (authData, departmentData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    departmentData = { ...departmentData, modifiedAt: modifiedAt };
    try {
        const isInactive = await isDepartmentInactiveQuery(departmentData.id);
        if (isInactive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'department_is_not_found'
                )
            )
        }
        if (isInactive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'inactive_department_can_not_be_updated'
                )
            )
        }
        const inactiveStatus = await updateDepartmentDataQuery(authData, departmentData);

        if (inactiveStatus === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'department_data_is_updated_successfully'
                )
            )
        }
    } catch (error) {
        // console.warn('🚀 ~ updateDepartmentData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    updateDepartmentData
}