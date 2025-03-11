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
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getZoneIdAndCodeCountQuery = async () => {
    const _query = `
        SELECT 
            zone_id, 
            zone_code
        FROM 
            zone
        ORDER BY 
            zone_id DESC
        LIMIT 1;
    `;

    try {
        const [result] = await pool.query(_query);
        if (result.length > 0) {
            // Increment zone_id by 1
            let zoneId = parseInt(result[0].zone_id, 10) + 1; // Convert to number, add 1
            zoneId = zoneId.toString();

            // Increment zone_code by 1
            let zoneCode = result[0].zone_code;
            let codeNumber = parseInt(zoneCode.substring(1), 10) + 1; // Extract numeric part, add 1
            zoneCode = 'Z' + codeNumber.toString().padStart(5, '0'); // Ensure it has 5 digits (e.g., 'M00001')

            return ({ zone_id: zoneId, zone_code: zoneCode });
        } else {
            const zoneId = '1';
            const zoneCode = 'Z00001';

            return ({ zone_id: zoneId, zone_code: zoneCode });
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get zone id and code count and return
 */
const getZoneIdCount = async () => {
    try {
        const countData = await getZoneIdAndCodeCountQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                countData
            )
        );
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}

module.exports = {
    getZoneIdCount
}