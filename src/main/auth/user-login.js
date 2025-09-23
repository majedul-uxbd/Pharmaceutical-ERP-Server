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
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLE_DESIGNATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-designation-column-name");
const { TABLE_MODULE_INFORMATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-module-information-column-name");
const { TABLE_DEPOT_INFO_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-depot-info-column-name");


const userLoginQuery = async (user) => {
    const query = `
	SELECT
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.ID},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.JOINING_DATE},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPORT_ID},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.MODULE_ID},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.PASSWORD},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.PROFILE_PIC},
        d.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME},
        mf.${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_NAME},
        df.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_NAME}
    FROM
        ${TABLES.TBL_Employees} AS e
    LEFT JOIN
         ${TABLES.TBL_DESIGNATION} AS d  
    ON e.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID} = d.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_ID}
    LEFT JOIN
        ${TABLES.TBL_MODULE_INFO} AS mf
    ON e.${TABLE_EMPLOYEES_COLUMNS_NAME.MODULE_ID} = mf.${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_ID}
    LEFT JOIN
        ${TABLES.TBL_DEPORT_INFO} AS df
    ON e.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPORT_ID} = df.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_ID}
    WHERE
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.USERNAME} = ? AND
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.MODULE_ID} = ? AND
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.ACTIVE_STATUS} = ${1};
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
        console.log("🚀 ~ userLogin ~ error:", error)
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