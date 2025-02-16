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


const getNumberOfRowsQuery = async () => {
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

const getUserDataQuery = async (paginationData) => {
    const query = `
    SELECT
        id,
        f_name,
        l_name,
        contact_no,
        address,
        email,
        role,
        profile_img,
        is_user_active,
        created_at,
        updated_at
    FROM
        user
    WHERE
        role = 'user'
    LIMIT ? OFFSET ?;

    ;
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

/**
 * @description This function is used to get all users data from the database
 */
const getAllUsersData = async (paginationData) => {
    try {
        const totalRows = await getNumberOfRowsQuery();
        const usersData = await getUserDataQuery(paginationData);
        const result = {
            metadata: {
                totalRows: totalRows,
            },
            data: usersData,
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'Get data successfully',
                result
            )
        );
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
    getAllUsersData
}