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
        department;
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getDepartmentDataQuery = async (paginationData) => {
    const query = `
        SELECT
            dp.id,
            dp.department_name,
            dp.department_id,
            dp.comment,
            created_by.full_name AS created_by,
            modified_by.full_name AS modified_by,
            dp.department_status,
            dp.created_at,
            dp.modified_at
        FROM
            department AS dp
        LEFT JOIN
            employees AS created_by 
        ON dp.created_by = created_by.id
        LEFT JOIN
            employees AS modified_by 
        ON dp.modified_by = modified_by.id
        WHERE
            dp.department_status = 1
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
 * @description This function will return the Department Information
 * @returns
 */
const getDepartmentData = async (paginationData) => {
    let totalRows;
    try {
        totalRows = await getNumberOfRowsQuery();
        const departmentData = await getDepartmentDataQuery(paginationData);
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
        console.log('🚀 ~ file: get-donation-data.js:188 ~ getDepartmentData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getDepartmentData
}