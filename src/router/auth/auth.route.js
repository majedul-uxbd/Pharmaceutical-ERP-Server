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
const { userLogin } = require("../../main/auth/user-login");
const { signupDataValidator } = require("../../middleware/auth/signup-data-validator");
const { userSignup } = require("../../main/auth/user-signup");
const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { getUserData } = require("../../main/auth/get-user-data");
const { getAllUsersData } = require("../../main/auth/get-all-users-data");
const { paginationData } = require("../../middleware/pagination-data");


/**
 * @description This API is used to register new users
 */
authRoute.post("/signup",
    signupDataValidator,
    async (req, res) => {
        userSignup(req.body.user)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message
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
 * @description This is used to get all user information
 */
authRoute.post("/get-all-users",
    authenticateToken,
    paginationData,
    async (req, res) => {
        getAllUsersData(req.body.paginationData)
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
