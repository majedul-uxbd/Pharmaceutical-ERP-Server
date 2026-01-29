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

const { pool } = require("../../_DB/db");
const { TABLE_BANK_INFORMATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-bank-information-column-name");
const { TABLE_EMPLOYEE_BANK_INFORMATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-bank-information-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");


const geBankInformationQuery = async (accountNo) => {
    const _query = `
        SELECT
            bank.${TABLE_BANK_INFORMATION_COLUMNS_NAME.ID},
            bank.${TABLE_BANK_INFORMATION_COLUMNS_NAME.SHORT_NAME},
            bank.${TABLE_BANK_INFORMATION_COLUMNS_NAME.BANK_NAME}
        FROM
            ${TABLES.TBL_BANK_INFORMATION} AS bank
        LEFT JOIN
            ${TABLES.TBL_EMPLOYEE_BANK_INFORMATION} AS bank_info
        ON
            bank_info.${TABLE_EMPLOYEE_BANK_INFORMATION_COLUMNS_NAME.BANK_ID} = bank.${TABLE_BANK_INFORMATION_COLUMNS_NAME.ID}
        WHERE
            bank_info.${TABLE_EMPLOYEE_BANK_INFORMATION_COLUMNS_NAME.ACCOUNT_NUMBER} = ?;
    `;

    try {
        const [result] = await pool.query(_query, [accountNo]);
        if (result.length > 0) {
            return result[0];
        } return false;
    } catch (error) {
        return Promise.reject(error)
    }
}


/**
 * @description This function will return employee information
 */
const bankInformation = async (accountNo) => {
    try {
        const bankList = await geBankInformationQuery(accountNo);
        if (bankList === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "bank_information_is_not_found"
                )
            )
        }
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                bankList
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
    bankInformation
}