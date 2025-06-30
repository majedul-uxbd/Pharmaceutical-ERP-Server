/**
 * @author Md. Majedul Islam
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require('../../_DB/db');
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");


const userLoginQuery = async (user) => {
    const query = `
	SELECT
        e.id,
        e.employee_id,
        e.full_name,
        e.joining_date,
        e.depot_id,
        df.depot_name,
        e.module_id,
        mf.module_name,
        e.designation_id,
        d.designation_name,
        e.password,
        e.profile_pic
    FROM
        employees AS e
    LEFT JOIN
        designation AS d  
    ON e.designation_id = d.designation_id
    LEFT JOIN
        module_info AS mf
    ON e.module_id = mf.module_id
    LEFT JOIN
        depot_info AS df
    ON e.depot_id = df.depot_id
    WHERE
        e.username = ? AND
        e.module_id = ? AND
        e.employee_status = ${1};
	`;
    const values = [
        user.username,
        user.module_id
    ];

    try {
        const [result] = await pool.query(query, values);
        return Promise.resolve(result[0]);
    } catch (error) {
        return Promise.reject(error);
    }
}

const generateToken = (userInfo) => {
    const token = jwt.sign({
        id: userInfo.id,
        employee_id: userInfo.employee_id,
        designation_id: userInfo.designation_id,
        designation: userInfo.designation_name,
        depot_id: userInfo.depot_id,
        depot_name: userInfo.depot_name,
        module_id: userInfo.module_id,
        module_name: userInfo.module_name,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '90d'
    });

    return token;
}

/**
 * @param {{
 * module_id: string,
 * username: string,
 * password: string
 * }} user 
 * @description This function is used to get user data and token
 */
const userLogin = async (user) => {
    let userInfo;

    if (!user.username || !user.password) {
        Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'username_or_password_is_required')
        );
    }
    try {
        userInfo = await userLoginQuery(user);
    } catch (error) {
        return Promise.reject(error);
    }

    if (!userInfo) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'username_or_password_is_required')
        );
    }

    let isPasswordCorrect;
    try {
        isPasswordCorrect = await bcrypt.compare(user.password, userInfo.password);  //compare user passwords
    } catch (error) {
        // console.log("🚀 ~ userLogin ~ error:", error)
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'invalid_password')
        );
    }

    if (!isPasswordCorrect) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'invalid_password')
        );
    }

    const token = generateToken(userInfo);

    const userData = {
        token: token,
        id: userInfo.id,
        employee_id: userInfo.employee_id,
        full_name: userInfo.full_name,
        designation_id: userInfo.designation_id,
        designation: userInfo.designation_name,
        depot_id: userInfo.depot_id,
        depot_name: userInfo.depot_name,
        module_id: userInfo.module_id,
        module_name: userInfo.module_name,
        profile_pic: userInfo.profile_pic
    }
    // console.warn('🚀 ~ file: user-login.js:105 ~ userLogin ~ userData:', userData);
    return Promise.resolve(
        setServerResponse(
            API_STATUS_CODE.ACCEPTED,
            'User logged in successfully',
            userData
        )
    )
}
module.exports = {
    userLogin
}