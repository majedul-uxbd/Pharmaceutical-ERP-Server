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

const getDesignationDataQuery = async (id) => {
    const _query = `
        SELECT
            designation_id,
            designation_code,
            designation_name
        FROM 
            designation
        WHERE
            id != ?;
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

const isDesignationInactiveQuery = async (id) => {
    const _query = `
        SELECT
            designation_status
        FROM
            designation
        WHERE
            id = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);

        if (result.length > 0) {
            if (result[0].designation_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const updateDesignationDataQuery = async (authData, designationData) => {
    const _query = `
        UPDATE
            designation
        SET
            designation_id = ?,
            designation_code = ?,
            designation_name = ?,
            description = ?,
            comment = ?,
            modified_by= ?,
            modified_at = ?
        WHERE
            id = ?;
    `;
    const _values = [
        designationData.designation_id,
        designationData.designation_code,
        designationData.designation_name,
        designationData.description,
        designationData.comment,
        authData.employee_id,
        designationData.modifiedAt,
        designationData.id
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
 * designation_id:string,
 * designation_code:string,
 * designation_name:string,
 * short_name:string,
 * description:string,
 * comment:string
 * }} designationData
 * @description This function is used to update designation data
 * @returns 
 */
const updateDesignationData = async (authData, designationData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    designationData = { ...designationData, modifiedAt: modifiedAt };
    try {
        const dbDesData = await getDesignationDataQuery(designationData.id);
        if (dbDesData === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'designation_is_not_found'
                )
            )
        }
        const matchedDepartment = dbDesData.find(
            (designation) =>
                designation.designation_id === designationData.designation_id ||
                designation.designation_code === designationData.designation_code ||
                designation.designation_name === designationData.designation_name
        );

        if (matchedDepartment) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'designation_data_already_exists'
                )
            )
        }
        const isInactive = await isDesignationInactiveQuery(designationData.id);
        if (isInactive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'designation_is_not_found'
                )
            )
        }
        if (isInactive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'inactive_designation_can_not_be_updated'
                )
            )
        }
        const inactiveStatus = await updateDesignationDataQuery(authData, designationData);

        if (inactiveStatus === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'designation_data_is_updated_successfully'
                )
            )
        }
    } catch (error) {
        // console.warn('🚀 ~ updateDesignationData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    updateDesignationData
}