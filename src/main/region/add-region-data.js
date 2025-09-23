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

const { pool } = require("../../_DB/db");
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");


const isZoneExistQuery = async (regionData) => {
    const _query = `
        SELECT
            zone_id
        FROM 
            zone
        WHERE
            zone_id = ?;
    `;
    const _values = [
        regionData.zone_id,
    ]
    // console.log({ _query, _values })
    try {
        const [result] = await pool.query(_query, _values);

        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const isRegionNameAlreadyExist = async (regionData) => {
    const _query = `
        SELECT
            region_name
        FROM 
            region
        WHERE
            region_name = ? OR region_code = ? OR region_id = ?;
    `;
    const _values = [
        regionData.region_name,
        regionData.region_code,
        regionData.region_id,
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const addRegionDataQuery = async (regionData) => {
    const _query = `
        INSERT INTO
            region
            (
                region_id,
                region_code,
                region_name,
                zone_id,
                comment
            )
        VALUES (?, ?, ?, ?, ?);
    `;
    const _values = [
        regionData.region_id,
        regionData.region_code,
        regionData.region_name,
        regionData.zone_id,
        regionData.comment,
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        // console.warn('🚀 ~ addRegionDataQuery ~ error:', error);
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * region_id:string,
 * region_code:string,
 * region_name:string,
 * zone_id:string,
 * comment:string
 * }} regionData 
 * @description This function is used to create a new region
 * @returns 
 */
const addRegionData = async (regionData) => {
    try {
        const isZoneExist = await isZoneExistQuery(regionData);
        if (isZoneExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'zone_is_not_found'
                )
            )
        }
        const isExist = await isRegionNameAlreadyExist(regionData);
        if (isExist === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.CONFLICT,
                    'region_name_already_exists'
                )
            )
        }
        const isAdded = await addRegionDataQuery(regionData);
        if (isAdded === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'region_is_created_successfully'
                )
            )
        }
    } catch (error) {
        // console.warn('🚀 ~ addRegionData ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    addRegionData
}