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
const { TABLE_DESIGNATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-designation-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");

const isDesignationNameAlreadyExist = async (designationData) => {
    const _query = `
        SELECT
            ${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME}
        FROM 
            ${TABLES.TBL_DESIGNATION}
        WHERE
            ${TABLE_DESIGNATION_COLUMNS_NAME.ID} = ? OR 
            ${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_CODE} = ? OR
            ${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME} = ?;
    `;
    const _values = [
        designationData.designation_name,
        designationData.designation_id,
        designationData.designation_code
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

const addDesignationDataQuery = async (authData, designationData) => {
    const _query = `
        INSERT INTO
            ${TABLES.TBL_DESIGNATION}
            (
                ${TABLE_DESIGNATION_COLUMNS_NAME.ID},
                ${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_CODE},
                ${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME},
                ${TABLE_DESIGNATION_COLUMNS_NAME.DESCRIPTION},
                ${TABLE_DESIGNATION_COLUMNS_NAME.COMMENT},
                ${TABLE_DESIGNATION_COLUMNS_NAME.CREATED_BY}
            )
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const _values = [
        designationData.designation_id,
        designationData.designation_code,
        designationData.designation_name,
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
 * designation_code:string,
 * designation_name:string,
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
                    'designation_data_already_exists'
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