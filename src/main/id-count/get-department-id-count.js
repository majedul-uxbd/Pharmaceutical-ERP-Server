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

const getDepartmentIdAndCodeCountQuery = async () => {
    const _query = `
        SELECT 
            department_id
        FROM 
            department
        ORDER BY 
            department_id DESC
        LIMIT 1;
    `;

    try {
        const [result] = await pool.query(_query);
        if (result.length > 0) {
            // Increment department_id by 1
            // let departmentId = parseInt(result[0].department_id, 10) + 1; // Convert to number, add 1
            // departmentId = departmentId.toString();

            // Increment department_code by 1
            let departmentId = result[0].department_id;
            let codeNumber = parseInt(departmentId.substring(4), 10) + 1; // Extract numeric part, add 1
            departmentId = 'DEPT' + codeNumber.toString().padStart(2, '0'); // Ensure it has 2 digits (e.g., 'M00001')

            return ({ department_id: departmentId });
        } else {
            const departmentId = 'DEPT01';

            return ({ department_id: departmentId });
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get Department id and code count and return
 */
const getDepartmentIdCount = async () => {
    try {
        const countData = await getDepartmentIdAndCodeCountQuery();
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
    getDepartmentIdCount
}