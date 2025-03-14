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

const getDesignationIdAndCodeCountQuery = async () => {
    const _query = `
        SELECT 
            designation_id
        FROM 
            designation
        ORDER BY 
            designation_id DESC
        LIMIT 1;
    `;

    try {
        const [result] = await pool.query(_query);
        if (result.length > 0) {
            // Increment designation_id by 1
            // let designationId = parseInt(result[0].designation_id, 10) + 1; // Convert to number, add 1
            // designationId = designationId.toString();

            // Increment designation_code by 1
            let designationId = result[0].designation_id;
            let codeNumber = parseInt(designationId.substring(3), 10) + 1; // Extract numeric part, add 1
            designationId = 'DES' + codeNumber.toString().padStart(2, '0'); // Ensure it has 2 digits (e.g., 'M00001')

            return ({ designation_id: designationId });
        } else {
            const designationId = 'DES01';

            return ({ designation_id: designationId });
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get designation id and code count and return
 */
const getDesignationIdCount = async () => {
    try {
        const countData = await getDesignationIdAndCodeCountQuery();
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
    getDesignationIdCount
}