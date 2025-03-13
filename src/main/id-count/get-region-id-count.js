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

const getRegionIdAndCodeCountQuery = async () => {
    const _query = `
        SELECT 
            region_id, 
            region_code
        FROM 
            region
        ORDER BY 
            region_id DESC
        LIMIT 1;
    `;

    try {
        const [result] = await pool.query(_query);
        if (result.length > 0) {
            // Increment region_id by 1
            let regionId = parseInt(result[0].region_id, 10) + 1; // Convert to number, add 1
            regionId = regionId.toString();

            // Increment region_code by 1
            let regionCode = result[0].region_code;
            let codeNumber = parseInt(regionCode.substring(1), 10) + 1; // Extract numeric part, add 1
            regionCode = 'R' + codeNumber.toString().padStart(5, '0'); // Ensure it has 5 digits (e.g., 'M00001')

            return ({ region_id: regionId, region_code: regionCode });
        } else {
            const regionId = '00001';
            const regionCode = 'R00001';

            return ({ region_id: regionId, region_code: regionCode });
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get region id and code count and return
 */
const getRegionIdCount = async () => {
    try {
        const countData = await getRegionIdAndCodeCountQuery();
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
    getRegionIdCount
}