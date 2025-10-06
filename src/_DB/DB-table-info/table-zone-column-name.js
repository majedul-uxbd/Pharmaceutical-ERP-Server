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
 * @description This file contains the column names for the zone information table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_ZONE_COLUMNS_NAME = Object.freeze({
    ID: 'id ',
    DEPOT_ID: 'depot_id ',
    ZONE_ID: 'zone_id  ',
    ZONE_CODE: 'zone_code  ',
    ZONE_NAME: 'zone_name',
    COMMENT: 'comment',
    CREATED_BY: 'created_by',
    MODIFIED_BY: 'modified_by',
    ACTIVE_STATUS: 'active_status',
    CREATED_AT: 'created_at',
    MODIFIED_AT: 'modified_at'
});

module.exports = {
    TABLE_ZONE_COLUMNS_NAME
};