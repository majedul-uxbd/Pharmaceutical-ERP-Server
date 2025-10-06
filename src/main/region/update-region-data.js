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

const _ = require('lodash');
const { format } = require('date-fns');
const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status")
const { setServerResponse } = require("../../utilities/server-response");
const { TABLE_REGION_COLUMNS_NAME } = require('../../_DB/DB-table-info/table-region-column-name');
const { TABLES } = require('../../_DB/DB-table-info/tables-name.const');

const isRegionInactiveQuery = async (id) => {
    const _query = `
        SELECT
            ${TABLE_REGION_COLUMNS_NAME.ACTIVE_STATUS}
        FROM
            ${TABLES.TBL_REGION}
        WHERE
            ${TABLE_REGION_COLUMNS_NAME.ID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);

        if (result.length > 0) {
            if (result[0].region_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const updateRegionDataQuery = async (regionData, authData) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_REGION}
        SET
            ${TABLE_REGION_COLUMNS_NAME.ZONE_ID} = ?,
            ${TABLE_REGION_COLUMNS_NAME.REGION_NAME} = ?,
            ${TABLE_REGION_COLUMNS_NAME.COMMENT} = ?,
            ${TABLE_REGION_COLUMNS_NAME.MODIFIED_BY} = ?,
            ${TABLE_REGION_COLUMNS_NAME.MODIFIED_AT} = ?
        WHERE
            ${TABLE_REGION_COLUMNS_NAME.ID} = ?;
    `;
    const _values = [
        regionData.zone_id,
        regionData.region_name,
        regionData.comment,
        authData.employee_id,
        regionData.modifiedAt,
        regionData.id
    ]
    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @param {{
 * id: string,
 * region_name:string,
 * zone_id:string,
 * comment:string
 * }} regionData 
 * @description This function is used to update region data
 * @returns 
 */
const updateRegionData = async (regionData, authData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    regionData = { ...regionData, modifiedAt: modifiedAt };

    try {
        const isInactive = await isRegionInactiveQuery(regionData.id);
        if (isInactive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'region_is_not_found'
                )
            )
        }
        if (isInactive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'inactive_region_can_not_be_updated'
                )
            )
        }
        const isUpdated = await updateRegionDataQuery(regionData, authData);

        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'region_data_is_updated_successfully'
                )
            )
        }
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    updateRegionData
}