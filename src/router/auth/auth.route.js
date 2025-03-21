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

const express = require("express");
const authRoute = express.Router();

const { loginUserValidation } = require("../../middleware/auth/login-validator");
const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { getUserData } = require("../../main/auth/get-user-data");
const { userLogin } = require("../../main/auth/user-login");
const { checkUserAccess } = require("../../main/auth/check-user-access");


/**
 * @description This is used to user login
 */
authRoute.post("/login",
    loginUserValidation,
    async (req, res) => {
        userLogin(req.body.user)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    token: data.data.token,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })

    });


/**
 * @description This is used to get user information
 */
authRoute.post("/get-user-data",
    authenticateToken,
    async (req, res) => {
        getUserData(req.auth)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });

/**
* @description This is used to check user module access status
*/
authRoute.post("/access-module",
    authenticateToken,
    async (req, res) => {
        checkUserAccess(req.auth)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });

module.exports = {
    authRoute,
};