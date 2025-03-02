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

const isDesignationNameAlreadyExist = async (designationData) => {
    const _query = `
        SELECT
            designation_name
        FROM 
            designation
        WHERE
            designation_name = ? OR designation_id = ?;
    `;
    const _values = [
        designationData.designation_name,
        designationData.designation_id,
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

const addDesignationDataQuery = async (authData, designationData) => {
    const _query = `
        INSERT INTO
            designation
            (
                designation_id,
                designation_name,
                short_name,
                description,
                comment,
                created_by
            )
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const _values = [
        designationData.designation_id,
        designationData.designation_name,
        designationData.short_name,
        designationData.description,
        designationData.comment,
        authData.employee_id
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        // console.warn('🚀 ~ adddesignationDataQuery ~ error:', error);
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * employee_id: string,
 * }} authData 
 * @param {{
 * designation_id:string,
 * designation_name:string,
 * short_name:string,
 * description:string,
 * comment:string
 * }} designationData 
 * @description This function is used to create a new designation
 * @returns 
 */
const addDesignationData = async (authData, designationData) => {
    try {
        const isExist = await isDesignationNameAlreadyExist(designationData);

        if (isExist === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'designation_name_already_exists'
                )
            )
        }
        const isAdded = await addDesignationDataQuery(authData, designationData);
        if (isAdded === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'designation_is_created_successfully'
                )
            )
        }
    } catch (error) {
        // console.warn('🚀 ~ addDesignationData ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    addDesignationData
}