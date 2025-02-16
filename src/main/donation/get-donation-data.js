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

const getNumberOfRowsAdminQuery = async () => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        donation;
    `;

    try {
        const [result] = await pool.query(query);
        return result[0].totalRows;
    } catch (error) {
        return error
    }
}

const getNumberOfRowsUserQuery = async (authData) => {
    const query = `
    SELECT
        count(*) totalRows
    FROM
        donation
    WHERE
        user_id = ?;
    `;

    const values = [
        authData.id
    ]

    try {
        const [result] = await pool.query(query, values);
        return result[0].totalRows;

    } catch (error) {
        return error
    }
}

const getDonationDataAdminQuery = async (paginationData) => {
    const query = `
    SELECT
        id,
        full_name,
        email,
        contact,
        address,
        occupation,
        donation_field,
        amount,
        transaction_id,
        comment,
        donation_status,
        created_at,
        updated_at
    FROM
        donation 
    LIMIT ? OFFSET ?;
    `;

    const values = [
        paginationData.itemsPerPage,
        paginationData.offset,
    ]

    try {
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        return error
    }
}

const getDonationDataUserQuery = async (authData, paginationData) => {
    const query = `
    SELECT
        id,
        full_name,
        email,
        contact,
        address,
        occupation,
        donation_field,
        amount,
        transaction_id,
        comment,
        donation_status,
        created_at,
        updated_at
    FROM
        donation
    WHERE
        user_id = ?
    LIMIT ? OFFSET ?;
    `;

    const values = [
        authData.id,
        paginationData.itemsPerPage,
        paginationData.offset,
    ]

    try {
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        return error
    }
}

/**
 * @param {Object} authData - An object containing the authentication details of the user.
 * @param {number} authData.id - The unique ID of the user.
 * @param {string} authData.email - The email address of the user.
 * @param {string} authData.role - The role of the user (e.g., 'admin', 'user').
 */
const getDonationData = async (authData, paginationData) => {
    const data = [];
    let totalRows;
    try {
        if (authData.role === 'admin') {
            totalRows = await getNumberOfRowsAdminQuery();
            const donationData = await getDonationDataAdminQuery(paginationData);
            const result = {
                metadata: {
                    totalRows: totalRows,
                },
                data: donationData,
            };
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'Get data successfully',
                    result
                )
            );
        } else {
            totalRows = await getNumberOfRowsUserQuery(authData);

            const donationData = await getDonationDataUserQuery(authData, paginationData);
            console.log('🚀 ~ file: get-donation-data.js:156 ~ getDonationData ~ donationData:', donationData);
            if (donationData.donation_status === 1) {
                const result = {
                    metadata: {
                        totalRows: totalRows,
                    },
                    data: donationData,
                };
                return Promise.resolve(
                    setServerResponse(
                        API_STATUS_CODE.OK,
                        'Get data successfully',
                        result
                    )
                );
            } else {
                const result = {
                    metadata: {
                        totalRows: 0,
                    },
                    data: data,
                };
                return Promise.resolve(
                    setServerResponse(
                        API_STATUS_CODE.OK,
                        'Get data successfully',
                        result
                    )
                );
            }
        }
    } catch (error) {
        console.log('🚀 ~ file: get-donation-data.js:188 ~ getDonationData ~ error:', error);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'Internal Server Error'
            )
        );
    }
}


module.exports = {
    getDonationData
}