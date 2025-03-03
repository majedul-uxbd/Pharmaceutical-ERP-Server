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


const getDepotDataQuery = async () => {
    const query = `
        SELECT
            id,
            depot_name,
            depot_id
        FROM
            depot_info;
    `;
    try {
        const [result] = await pool.query(query);
        return result;
    } catch (error) {
        // console.log("🚀 ~ userLoginQuery ~ error:", error)
        return Promise.reject(error);
    }
}


/**
 * @description This function is used to get depot information from the database
 */
const getDepotData = async () => {
    try {
        const depotData = await getDepotDataQuery();

        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                depotData
            )
        );
    } catch (error) {
        console.warn('🚀 ~ getDepotData ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error"
            )
        );
    }
}

module.exports = {
    getDepotData
}