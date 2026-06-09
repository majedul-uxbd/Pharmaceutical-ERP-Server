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
const { TABLE_ZONE_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-zone-column-name");

const isZoneNameAlreadyExist = async (zoneData) => {
    const _query = `
        SELECT
            ${TABLE_ZONE_COLUMNS_NAME.ZONE_NAME}
        FROM 
            ${TABLES.TBL_ZONE}
        WHERE
            ${TABLE_ZONE_COLUMNS_NAME.ZONE_NAME} = ? 
            OR ${TABLE_ZONE_COLUMNS_NAME.ZONE_CODE} = ? 
            OR ${TABLE_ZONE_COLUMNS_NAME.ID} = ?;
    `;
    const _values = [
        zoneData.zone_name,
        zoneData.zone_code,
        zoneData.zone_id,
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

const addZoneDataQuery = async (authData, zoneData) => {
    const _query = `
        INSERT INTO
            ${TABLES.TBL_ZONE}
            (
                ${TABLE_ZONE_COLUMNS_NAME.ID},
                ${TABLE_ZONE_COLUMNS_NAME.ZONE_CODE},
                ${TABLE_ZONE_COLUMNS_NAME.ZONE_NAME},
                ${TABLE_ZONE_COLUMNS_NAME.DEPOT_ID},
                ${TABLE_ZONE_COLUMNS_NAME.COMMENT},
                ${TABLE_ZONE_COLUMNS_NAME.CREATED_BY}
            )
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const _values = [
        zoneData.zone_id,
        zoneData.zone_code,
        zoneData.zone_name,
        zoneData.depot_id,
        zoneData.comment,
        authData.employee_id
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
 * zone_id:string,
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