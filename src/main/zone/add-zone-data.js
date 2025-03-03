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

const { reject } = require("lodash");
const { pool } = require("../../_DB/db");
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");

const isZoneNameAlreadyExist = async (zoneData) => {
    const _query = `
        SELECT
            zone_name
        FROM 
            zone
        WHERE
            zone_name = ? OR zone_code = ?;
    `;
    const _values = [
        zoneData.zone_name,
        zoneData.zone_code,
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise / reject(error);
    }
}

const addZoneDataQuery = async (authData, zoneData) => {
    const _query = `
        INSERT INTO
            zone
            (
                zone_code,
                zone_name,
                depot_id,
                comment
            )
        VALUES (?, ?, ?, ?);
    `;
    const _values = [
        zoneData.zone_code,
        zoneData.zone_name,
        zoneData.depot_id,
        zoneData.comment,
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        // console.warn('🚀 ~ addZoneDataQuery ~ error:', error);
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * employee_id: string,
 * }} authData 
 * @param {{
 * zone_code:string,
 * zone_name:string,
 * depot_id:string,
 * comment:string
 * }} zoneData 
 * @description This function is used to create a new zone
 * @returns 
 */
const addZoneData = async (authData, zoneData) => {
    try {
        const isExist = await isZoneNameAlreadyExist(zoneData);

        if (isExist === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'zone_name_already_exists'
                )
            )
        }
        const isAdded = await addZoneDataQuery(authData, zoneData);
        if (isAdded === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'zone_is_created_successfully'
                )
            )
        }
    } catch (error) {
        console.warn('🚀 ~ addZoneData ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    addZoneData
}