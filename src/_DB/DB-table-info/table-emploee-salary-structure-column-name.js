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
 * @description This file contains the column names for the employee salary structure table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_EMPLOYEE_SALARY_STRUCTURE_COLUMNS_NAME = Object.freeze({
    ID: 'id ',
    EMPLOYEE_ID: 'employee_id ',
    DEPARTMENT_ID: 'department_id',
    DESIG: 'designation_id',
    DESCRIPTION: 'salary_head_id',
    COMMENT: 'salary_effective_date',
    COMMENT: 'salary_pf_date',
    COMMENT: 'salary_group_id',
    CREATED_BY: 'created_by',
    MODIFIED_BY: 'modified_by',
    ACTIVE_STATUS: 'active_status',
    CREATED_AT: 'created_at',
    MODIFIED_AT: 'modified_at'
});

module.exports = {
    TABLE_EMPLOYEE_SALARY_STRUCTURE_COLUMNS_NAME
};