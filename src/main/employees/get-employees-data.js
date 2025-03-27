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
        employees;
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getEmployeesDataQuery = async (paginationData) => {
    const query = `
        SELECT
            em.id,
            em.employee_id,
            em.full_name,
            em.username,
            em.email,
            em.contact,
            em.present_address,
            em.permanent_address,
            em.joining_date,
            ps.place_name,
            em.permanent_date,
            des.designation_name,
            dept.department_name,
            dep.depot_name,
            modl.module_name,
            em.employee_status,
            em.created_at,
            em.modified_at
        FROM
            employees as em 
        LEFT JOIN
            designation des 
        ON em.designation_id = des.designation_id
        LEFT JOIN
            department AS dept 
        ON em.department_id = dept.department_id
        LEFT JOIN
            posting_place AS ps
        ON em.posting_place = ps.place_id
        LEFT JOIN
            depot_info AS dep
        ON em.depot_id = dep.depot_id
        LEFT JOIN
            module_info AS modl
        ON em.module_id = modl.module_id
        ORDER BY em.created_at DESC
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
 * @description This function will return the Employees Information
 * @returns
 */
const getEmployeesData = async (paginationData) => {
    let totalRows;
    try {
        totalRows = await getNumberOfRowsQuery();
        const employeesData = await getEmployeesDataQuery(paginationData);
        const result = {
            metadata: {
                totalRows: totalRows,
            },
            data: employeesData,
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                result
            )
        );
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getEmployeesData
}