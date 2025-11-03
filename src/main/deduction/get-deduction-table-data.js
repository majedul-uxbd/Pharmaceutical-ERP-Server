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
const { TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-salary-deduction-element-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");


const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        ${TABLES.TBL_SALARY_DEDUCTION_ELEMENT};
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getDeductionTableDataQuery = async (paginationData) => {
    const _query = `
        SELECT
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.ID},
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.DEDUCTION_ID},
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.DEDUCTION_NAME},
            created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS created_by,
            modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS modified_by,
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.CREATED_AT},
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.MODIFIED_AT}
        FROM
            ${TABLES.TBL_SALARY_DEDUCTION_ELEMENT} AS deduction
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS created_by
        ON
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.CREATED_BY} = created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS modified_by
        ON
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.MODIFIED_BY} = modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        ORDER BY
            deduction.${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.ID}
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
        return error
    }
}


const getDeductionTableData = async (paginationData) => {
    try {
        const totalRows = await getNumberOfRowsQuery();

        const tableData = await getDeductionTableDataQuery(paginationData);
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
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    getDeductionTableData
}