/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */

const { pool } = require("../../_DB/db");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const deleteDonationDataQuery = async (id) => {
    const query = `
        DELETE
        FROM
            donation
        WHERE
            id = ?;
    `
    try {
        const [result] = await pool.query(query, [id]);
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
 * @description This function is used to delete donation data from the database
 */
const deleteDonationData = async (id) => {
    try {
        const idDelete = await deleteDonationDataQuery(id);
        if (idDelete) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'Data is deleted successfully'
                )
            );
        } else {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'Failed to delete data'
                )
            );
        }
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'Internal Server Error'
            )
        );
    }
}

module.exports = {
    deleteDonationData
}