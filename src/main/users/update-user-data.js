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

const { format } = require("date-fns");
const { pool } = require("../../_DB/db");
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");


const updateUserInfoQuery = (authData, userData) => {
    let id;
    if (authData.role === 'admin') {
        id = userData.id;
    } else {
        id = authData.id;
    }
    let _query = `UPDATE user SET `;
    const _values = [];

    if (userData.firstName) {
        _query += 'f_name = ? ';
        _values.push(userData.firstName);
    }

    if (userData.lastName) {
        if (_values.length > 0) {
            _query += ', ';
        }
        _query += 'l_name = ? ';
        _values.push(userData.lastName);
    }

    if (userData.contact) {
        if (_values.length > 0) {
            _query += ', ';
        }
        _query += 'contact_no = ? ';
        _values.push(userData.contact);
    }

    if (userData.address) {
        if (_values.length > 0) {
            _query += ', ';
        }
        _query += 'address = ? ';
        _values.push(userData.address);
    }
    if (_values.length > 0) {
        _query += ', updated_at = ? ';
        _values.push(userData.updated_at);
    }

    _query += 'WHERE id  =?';
    _values.push(id);

    return [_query, _values];
};

/**
 * This function is used to update user data
 */
const updateUserData = async (authData, userData) => {
    const updatedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");;
    console.log('🚀 ~ file: update-user-data.js:72 ~ updateUserData ~ updatedAt:', updatedAt);

    userData = { ...userData, updated_at: updatedAt }
    try {
        const [_query, _values] = await updateUserInfoQuery(authData, userData);
        const [isUpdateUser] = await pool.query(_query, _values);
        if (isUpdateUser.affectedRows > 0) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'User data is updated successfully',
                )
            );
        } else {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'Failed to update user data',
                    lgKey,
                )
            )
        }
    } catch (error) {
        // console.log("🚀 ~ updateUserInfo ~ error:", error)
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'Internal Server Error',
            )
        )
    }
}

module.exports = {
    updateUserData
}