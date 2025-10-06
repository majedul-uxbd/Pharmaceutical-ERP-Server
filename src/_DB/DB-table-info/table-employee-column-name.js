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
 * @description This file contains the column names for the employees table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_EMPLOYEES_COLUMNS_NAME = Object.freeze({
    ID: 'id ',
    EMPLOYEE_ID: 'employee_id ',
    Full_NAME: 'full_name',
    USERNAME: 'username',
    EMAIL: 'email',
    CONTACT: 'contact',
    PRESENT_ADDRESS: 'present_address',
    PERMANENT_ADDRESS: 'permanent_address',
    JOINING_DATE: 'joining_date',
    PERMANENT_DATE: 'permanent_date',
    POSTING_PLACE: 'posting_place',
    MODULE_ID: 'module_id',
    DEPORT_ID: 'depot_id',
    NID_NO: 'nid_no',
    PASSWORD: 'password',
    CREATED_BY: 'created_by',
    MODIFIED_BY: 'modified_by',
    DESIGNATION_ID: 'designation_id',
    DEPARTMENT_ID: 'department_id',
    ACTIVE_STATUS: 'active_status',
    PROFILE_PIC: 'profile_pic',
    CREATED_AT: 'created_at',
    MODIFIED_AT: 'modified_at'
});

module.exports = {
    TABLE_EMPLOYEES_COLUMNS_NAME
};