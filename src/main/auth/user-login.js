/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
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

const userLoginQuery = async (email) => {
    const query = `
	SELECT
		id,
        f_name,
        l_name,
        email,
        role,
        password,
        profile_img
	FROM
		user
	WHERE
		email = ?;
	`;
    const values = [
        email
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
        email: userInfo.email,
        role: userInfo.role
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '90d'
    });

    return token;
}

const userLogin = async (user) => {
    let userInfo;

    if (!user.email || !user.password) {
        Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'Email or password is required')
        );
    }
    try {
        userInfo = await userLoginQuery(user.email);
    } catch (error) {
        return Promise.reject(error);
    }

    if (!userInfo) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'Invalid email or password')
        );
    }

    let isPasswordCorrect;
    try {
        isPasswordCorrect = await bcrypt.compare(user.password, userInfo.password);  //compare user passwords
    } catch (error) {
        // console.log("🚀 ~ userLogin ~ error:", error)
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'Invalid password')

        );
    }

    if (!isPasswordCorrect) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'Invalid password')
        );
    }

    const token = generateToken(userInfo);

    const userData = {
        token: token,
        id: userInfo.id,
        f_name: userInfo.f_name,
        l_name: userInfo.l_name,
        email: userInfo.email,
        role: userInfo.role,
        profile_img: userInfo.profile_img
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