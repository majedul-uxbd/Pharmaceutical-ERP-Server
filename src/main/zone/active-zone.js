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
const { setServerResponse } = require('../../utilities/server-response');
const { API_STATUS_CODE } = require('../../consts/error-status');
const { pool } = require('../../_DB/db');

const isZoneStatusActive = async (id) => {
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
            if (result[0].zone_status === 1) {
                return true;
            } else {
                return false;
            }
        } return 0;
    } catch (error) {
        // console.log('🚀 ~ isDepartmentStatusInactive ~ error:', error);
        return Promise.reject(error);
    }
}


const activeZoneStatus = async (id) => {
    const _query = `
        UPDATE
            zone
        SET
            zone_status = ${1}
        WHERE
            id = ?;
    `;
    try {
        const [result] = await pool.query(_query, [id]);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {number} id 
 * @description This function is used to active zone
 * @returns 
 */
const activeZone = async (id) => {
    if (_.isNil(id)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'zone_id_is_required'
            )
        )
    };
    try {
        const isActive = await isZoneStatusActive(id);
        if (isActive === 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'zone_is_not_found'
                )
            )
        }
        if (isActive === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'zone_is_already_active'
                )
            )
        }

        const isUpdated = await activeZoneStatus(id);
        if (isUpdated === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'zone_is_activated_successfully'
                )
            )
        }
    } catch (error) {
        // console.log('🚀 ~ activeDepartment ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        )
    }
}

module.exports = {
    activeZone
}