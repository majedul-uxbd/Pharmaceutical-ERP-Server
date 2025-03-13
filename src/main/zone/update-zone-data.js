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
const { setServerResponse } = require("../../utilities/server-response")

const isZoneInactiveQuery = async (id) => {
    const _query = `
        SELECT
            zone_status
        FROM
            zone
        WHERE
            id = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);

        if (result.length > 0) {
            if (result[0].zone_status === 0) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        return Promise.reject(error);
    }
}

const updateZoneDataQuery = async (zoneData) => {
    const _query = `
        UPDATE
            zone
        SET
            depot_id = ?,
            zone_name = ?,
            comment = ?,
            modified_at = ?
        WHERE
            id = ?;
    `;
    const _values = [
        zoneData.depot_id,
        zoneData.zone_name,
        zoneData.comment,
        zoneData.modifiedAt,
        zoneData.id
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
 * employee_id: string,
 * }} authData 
 * @param {{
 * id:number,
 * depot_id:string,
 * zone_name:string,
 * comment:string
 * }} zoneData
 * @description This function is used to update zone data
 * @returns 
 */
const updateZoneData = async (zoneData) => {
    const modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    zoneData = { ...zoneData, modifiedAt: modifiedAt };

    try {
        const isInactive = await isZoneInactiveQuery(zoneData.id);
        if (isInactive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'zone_is_not_found'
                )
            )
        }
        if (isInactive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'inactive_zone_can_not_be_updated'
                )
            )
        }
        const isUpdated = await updateZoneDataQuery(zoneData);

        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'zone_data_is_updated_successfully'
                )
            )
        }
    } catch (error) {
        console.warn('🚀 ~ updateZoneData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    updateZoneData
}