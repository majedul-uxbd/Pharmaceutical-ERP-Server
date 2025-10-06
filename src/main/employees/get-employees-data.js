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
const { TABLE_DEPARTMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-department-column-name");
const { TABLE_DEPOT_INFO_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-depot-info-column-name");
const { TABLE_DESIGNATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-designation-column-name");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLE_MODULE_INFORMATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-module-information-column-name");
const { TABLE_POSTING_PLACE_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-posting-place-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        ${TABLES.TBL_EMPLOYEES};
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
        SELECT DISTINCT 
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.ID},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.USERNAME},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.EMAIL},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.CONTACT},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.PRESENT_ADDRESS},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.PERMANENT_ADDRESS},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.JOINING_DATE},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.PERMANENT_DATE},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.CREATED_AT},
            em.${TABLE_EMPLOYEES_COLUMNS_NAME.MODIFIED_AT},
            ps.${TABLE_POSTING_PLACE_COLUMNS_NAME.PLACE_NAME},
            des.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME},
            dept.${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME},
            dep.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_NAME},
            module.${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_NAME}
        FROM
            ${TABLES.TBL_EMPLOYEES} as em 
        LEFT JOIN
            ${TABLES.TBL_DESIGNATION} des 
        ON em.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID} = des.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_ID}
        LEFT JOIN
            ${TABLES.TBL_DEPARTMENT} AS dept 
        ON em.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPARTMENT_ID} = dept.${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID}
        LEFT JOIN
            ${TABLES.TBL_POSTING_INFO} AS ps
        ON em.${TABLE_EMPLOYEES_COLUMNS_NAME.POSTING_PLACE} = ps.${TABLE_POSTING_PLACE_COLUMNS_NAME.PLACE_ID}
        LEFT JOIN
            ${TABLES.TBL_DEPORT_INFO} AS dep
        ON em.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPORT_ID} = dep.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_ID}
        LEFT JOIN
            ${TABLES.TBL_MODULE_INFO} AS module
        ON em.${TABLE_EMPLOYEES_COLUMNS_NAME.MODULE_ID} = module.${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_ID}
        ORDER BY em.${TABLE_EMPLOYEES_COLUMNS_NAME.CREATED_AT} DESC
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
        return Promise.reject(error);
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