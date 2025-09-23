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
 * @description This file contains the column names for the depot information table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_DEPOT_INFO_COLUMNS_NAME = Object.freeze({
    ID: 'id ',
    DEPOT_NAME: 'depot_name ',
    DEPOT_ID: 'depot_id',
    COMMENT: 'comment',
    DEPOT_ADDRESS1: 'depot_address1',
    DEPOT_ADDRESS2: 'depot_address2',
    DEPOT_ADDRESS3: 'depot_address3',
    DEPOT_CONTACT: 'depot_contact',
    CREATED_BY: 'created_by',
    MODIFIED_BY: 'modified_by',
    ACTIVE_STATUS: 'active_status',
    CREATED_AT: 'created_at',
    MODIFIED_AT: 'modified_at'
});

module.exports = {
    TABLE_DEPOT_INFO_COLUMNS_NAME
};