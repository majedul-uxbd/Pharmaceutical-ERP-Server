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


/**
 * @description This file contains the column names for the employees bank status table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_EMPLOYEE_BANK_INFORMATION_COLUMNS_NAME = Object.freeze({
    ID: 'id ',
    BANK_NAME: 'employee_id ',
    SHORT_NAME: 'bank_id',
    ACCOUNT_NUMBER: 'account_number',
    BRANCH_NAME: 'branch_name',
    BRANCH_CODE: 'branch_code',
    CREATED_BY: 'created_by',
    MODIFIED_BY: 'modified_by',
    ACTIVE_STATUS: 'active_status',
    CREATED_AT: 'created_at',
    MODIFIED_AT: 'modified_at'
});

module.exports = {
    TABLE_EMPLOYEE_BANK_INFORMATION_COLUMNS_NAME
};