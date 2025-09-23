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
 * @description This file contains the column names for the salary head table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_SALARY_HEAD_COLUMNS_NAME = Object.freeze({
    ID: 'id ',
    NAME: 'name',
    HEAD_ID: 'head_id',
    CREATED_BY: 'created_by',
    MODIFIED_BY: 'modified_by',
    ACTIVE_STATUS: 'active_status',
    CREATED_AT: 'created_at',
    MODIFIED_AT: 'modified_at'
});

module.exports = {
    TABLE_SALARY_HEAD_COLUMNS_NAME
};