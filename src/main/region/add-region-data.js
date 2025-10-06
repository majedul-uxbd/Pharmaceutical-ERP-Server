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
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { TABLE_REGION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-region-column-name");
const { TABLE_ZONE_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-zone-column-name");


const isZoneExistQuery = async (regionData) => {
    const _query = `
        SELECT
            ${TABLE_ZONE_COLUMNS_NAME.ZONE_ID}
        FROM 
            ${TABLES.TBL_ZONE}
        WHERE
            ${TABLE_ZONE_COLUMNS_NAME.ZONE_ID} = ?;
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
            ${TABLE_REGION_COLUMNS_NAME.REGION_NAME}
        FROM 
            ${TABLES.TBL_REGION}
        WHERE
            ${TABLE_REGION_COLUMNS_NAME.REGION_NAME} = ? OR 
            ${TABLE_REGION_COLUMNS_NAME.REGION_CODE} = ? OR 
            ${TABLE_REGION_COLUMNS_NAME.REGION_ID} = ?;
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

const addRegionDataQuery = async (regionData, authData) => {
    const _query = `
        INSERT INTO
            ${TABLES.TBL_REGION}
            (
                ${TABLE_REGION_COLUMNS_NAME.REGION_ID},
                ${TABLE_REGION_COLUMNS_NAME.REGION_CODE},
                ${TABLE_REGION_COLUMNS_NAME.REGION_NAME},
                ${TABLE_REGION_COLUMNS_NAME.CREATED_BY},
                ${TABLE_REGION_COLUMNS_NAME.ZONE_ID},
                ${TABLE_REGION_COLUMNS_NAME.COMMENT}
            )
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const _values = [
        regionData.region_id,
        regionData.region_code,
        regionData.region_name,
        authData.employee_id,
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
 * Creates a new region entry in the database after validating zone existence and region uniqueness.
 * Returns a server response indicating the result (success, already exists, zone not found, or error).
 *
 * @param {{
 *   region_id: string,
 *   region_code: string,
 *   region_name: string,
 *   zone_id: string,
 *   comment: string
 * }} regionData - The region details to be added.
 * @param {{ employee_id: string }} authData - Authenticated user data, must include employee_id of the creator.
 * @returns {Promise<Object>} - Rejects with a server response object indicating the result (success, error, or conflict).
 */
const addRegionData = async (regionData, authData) => {
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
        const isAdded = await addRegionDataQuery(regionData, authData);
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