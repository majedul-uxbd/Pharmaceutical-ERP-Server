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

const { TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-salary-deduction-element-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const getDeductionListQuery = async () => {
    const _query = `
        SELECT
            ${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.ID},
            ${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.DEDUCTION_ID},
            ${TABLE_SALARY_DEDUCTION_ELEMENT_COLUMNS_NAME.DEDUCTION_NAME}
        FROM
            ${TABLES.TBL_SALARY_DEDUCTION_ELEMENT};
    `;

    try {
        const [result] = await pool.query(_query);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * @description This function is used to get deduction list
 * @returns {Promise<Object>} If successful, returns a server response object with deduction list
 */
const getDeductionList = async () => {
    try {
        const deductionList = await getDeductionListQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                deductionList
            )
        );
    } catch (error) {
        console.log("🚀 ~ getDeductionList ~ error:", error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    getDeductionList
}
