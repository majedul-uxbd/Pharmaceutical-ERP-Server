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

const isRegionInactiveQuery = async (id) => {
    const _query = `
        SELECT
            region_status
        FROM
            region
        WHERE
            id = ?;
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

const updateRegionDataQuery = async (regionData) => {
    const _query = `
        UPDATE
            region
        SET
            zone_id = ?,
            region_id = ?,
            region_name = ?,
            region_code = ?,
            comment = ?,
            modified_at = ?
        WHERE
            id = ?;
    `;
    const _values = [
        regionData.zone_id,
        regionData.region_id,
        regionData.region_name,
        regionData.region_code,
        regionData.comment,
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
 * region_id:string,
 * region_code:string,
 * region_name:string,
 * zone_id:string,
 * comment:string
 * }} regionData 
 * @description This function is used to update region data
 * @returns 
 */
const updateRegionData = async (regionData) => {
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
        const isUpdated = await updateRegionDataQuery(regionData);

        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'region_data_is_updated_successfully'
                )
            )
        }
    } catch (error) {
        console.warn('🚀 ~ updateRegionData ~ error:', error);
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