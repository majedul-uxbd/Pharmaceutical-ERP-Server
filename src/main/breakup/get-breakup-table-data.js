/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-salary-breakup-element-column-name");
const { TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-salary-deduction-element-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows  
    FROM
        ${TABLES.TBL_SALARY_BREAKUP_ELEMENT};
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getBreakupTableDataQuery = async (paginationData) => {
    const _query = `
        SELECT
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.ID},
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.BREAKUP_ID},
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.BREAKUP_NAME},
            created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.FULL_NAME} AS created_by,
            modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.FULL_NAME} AS modified_by,
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.CREATED_AT},
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.MODIFIED_AT}
        FROM
            ${TABLES.TBL_SALARY_BREAKUP_ELEMENT} AS breakup
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS created_by
        ON
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.CREATED_BY} = created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS modified_by
        ON
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.MODIFIED_BY} = modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        ORDER BY
            breakup.${TABLE_SALARY_BREAKUP_ELEMENT_COLUMNS_NAME.ID}
        DESC
        LIMIT ? OFFSET ?;
    `;

    const _values = [
        paginationData.itemsPerPage,
        paginationData.offset,
    ]

    try {
        const [result] = await pool.query(_query, _values);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get breakup table data
 * @param {{
 *     itemsPerPage: number,
 *     offset: number
 * }} paginationData - Pagination data
 * @returns {Promise<Object>} If successful, returns a server response object with breakup table data
 */
const getBreakupTableData = async (paginationData) => {
    try {
        const totalRows = await getNumberOfRowsQuery();

        const tableData = await getBreakupTableDataQuery(paginationData);
        const result = {
            metadata: {
                totalRows: totalRows,
            },
            data: tableData,
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                result
            )
        );
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
    getBreakupTableData
}