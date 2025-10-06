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
const { TABLE_DESIGNATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-designation-column-name");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getNumberOfRowsQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        ${TABLES.TBL_DESIGNATION};
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
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.ID},
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_ID},
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_CODE},
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME},
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.COMMENT},
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.DESCRIPTION},
            created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS created_by,
            modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME} AS modified_by,
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.ACTIVE_STATUS},
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.CREATED_AT},
            ds.${TABLE_DESIGNATION_COLUMNS_NAME.MODIFIED_AT}
        FROM
            ${TABLES.TBL_DESIGNATION} AS ds
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS created_by 
        ON ds.${TABLE_DESIGNATION_COLUMNS_NAME.CREATED_BY} = created_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEES} AS modified_by 
        ON ds.${TABLE_DESIGNATION_COLUMNS_NAME.MODIFIED_BY} = modified_by.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID}
        ORDER BY ds.${TABLE_DESIGNATION_COLUMNS_NAME.ID} DESC
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
    try {
        const totalRows = await getNumberOfRowsQuery();
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