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


const addDonationDataQuery = async (donationData, authData) => {
    const query = `
        INSERT INTO
        donation
        (
            user_id,
            full_name,
            email,
            contact,
            address,
            occupation,
            donation_field,
            amount,
            transaction_id,
            comment
        )
	VALUES (?,?,?,?,?,?,?,?,?,?);
    `;

    const values = [
        authData.id,
        donationData.fullName,
        donationData.email,
        donationData.contact,
        donationData.address,
        donationData.occupation,
        donationData.donation_field,
        donationData.amount,
        donationData.transactionId,
        donationData.comment
    ];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows > 0) {
            return true;
        }
        return false;
    } catch (error) {
        // console.log("🚀 ~ userLoginQuery ~ error:", error)
        return Promise.reject(error);
    }

}


/**
 * @description This function is used to insert donation data in database 
 */
const addDonationData = async (donationData, authData) => {
    try {
        const isDataInserted = await addDonationDataQuery(donationData, authData);

        if (isDataInserted) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    "Your contribution has been successfully recorded"
                )
            );
        }

    } catch (error) {
        // console.log('🚀 ~ file: add-donation-data.js:82 ~ addDonationData ~ r:', r);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "Internal Server Error"
            )
        );
    }
}

module.exports = {
    addDonationData
}