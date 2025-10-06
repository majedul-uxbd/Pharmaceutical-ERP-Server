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
 * @description This file contains the column names for the bank information table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_BANK_INFORMATION_COLUMNS_NAME = Object.freeze({
    ID: 'id ',
    BANK_NAME: 'bank_name ',
    SHORT_NAME: 'short_name',
    ADDRESS: 'address',
    CREATED_AT: 'created_at',
    MODIFIED_AT: 'modified_at'
});

module.exports = {
    TABLE_BANK_INFORMATION_COLUMNS_NAME
};