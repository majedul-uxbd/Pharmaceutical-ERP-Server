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
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        designation;
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getDesignationDataQuery = async (paginationData) => {
    const query = `
        SELECT
            ds.id,
            ds.designation_name,
            ds.designation_id,
            ds.short_name,
            ds.description,
            ds.comment,
            created_by.full_name AS created_by,
            modified_by.full_name AS modified_by,
            ds.designation_status,
            ds.created_at,
            ds.modified_at
        FROM
            designation AS ds
        LEFT JOIN
            employees AS created_by 
        ON ds.created_by = created_by.id
        LEFT JOIN
            employees AS modified_by 
        ON ds.modified_by = modified_by.id
        WHERE
            ds.designation_status = 1
        LIMIT ? OFFSET ?;
    `;

    const values = [
        paginationData.itemsPerPage,
        paginationData.offset,
    ]

    try {
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        return error
    }
}

/**
 * @param {Object} paginationData - An object containing the pagination details.
 * @description This function will return the Designation Information
 * @returns
 */
const getDesignationData = async (paginationData) => {
    let totalRows;
    try {
        totalRows = await getNumberOfRowsQuery();
        const departmentData = await getDesignationDataQuery(paginationData);
        const result = {
            metadata: {
                totalRows: totalRows,
            },
            data: departmentData,
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                result
            )
        );
    } catch (error) {
        console.log('🚀 ~ file: get-donation-data.js:188 ~ getDesignationData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getDesignationData
}