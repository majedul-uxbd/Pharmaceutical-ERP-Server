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
const { setServerResponse } = require("../../utilities/server-response");
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');
const { TABLE_DEPARTMENT_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-department-column-name');

const getDepartmentDataQuery = async (id) => {
    const _query = `
        SELECT
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID},
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_CODE},
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME}
        FROM 
            ${TABLES.TBL_DEPARTMENT} 
        WHERE
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ID} != ?;
    `;
    try {
        const [result] = await pool.query(_query, id);
        if (result.length > 0) {
            return result;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const isDepartmentInactiveQuery = async (id) => {
    const _query = `
        SELECT
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_DEPARTMENT}
        WHERE
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.length > 0) {
            if (result[0].active_status === 0) {
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
            ${TABLES.TBL_DEPARTMENT}
        SET
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_CODE} = ?,
            ${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME} = ?,
            ${TABLE_DEPARTMENT_COLUMNS_NAME.COMMENT} = ?,
            ${TABLE_DEPARTMENT_COLUMNS_NAME.MODIFIED_BY}= ?,
            ${TABLE_DEPARTMENT_COLUMNS_NAME.MODIFIED_AT} = ?
        WHERE
            ${TABLE_DEPARTMENT_COLUMNS_NAME.ID} = ?;
    `;
    const _values = [
        // departmentData.department_id,
        departmentData.department_code,
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
 * employee_id: string,
 * }} authData 
 * @param {{
 * id:number,
 * department_id:string,
 * department_code:string,
 * department_name:string,
 * comment:string
 * }} departmentData }
 * @description This function is used to update department data
 */
const updateDepartmentData = async (authData, departmentData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    departmentData = { ...departmentData, modifiedAt: modifiedAt };
    try {
        const dbDeptData = await getDepartmentDataQuery(departmentData.id);
        if (dbDeptData === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'department_is_not_found'
                )
            )
        }
        const matchedDepartment = dbDeptData.find(
            (dept) =>
                dept.department_id === departmentData.department_id ||
                dept.department_code === departmentData.department_code ||
                dept.department_name === departmentData.department_name
        );

        if (matchedDepartment) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'department_data_already_exists'
                )
            )
        }
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
        const isUpdated = await updateDepartmentDataQuery(authData, departmentData);

        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'department_data_is_updated_successfully'
                )
            )
        }
    } catch (error) {
        return Promise.reject(
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