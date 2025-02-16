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
const { deleteUserData } = require("../../main/users/delete-user-data");
const { updateUserData } = require("../../main/users/update-user-data");
const { userDataValidator } = require("../../middleware/user/user-data-validator");
const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const userRoute = express.Router();

userRoute.use(authenticateToken);
/**
* @description This API is used to delete user data from the database
*/
userRoute.post("/delete",
    async (req, res) => {
        deleteUserData(req.body.id)
            .then(data => {
                const { statusCode, status, message } = data;
                return res.status(statusCode).send({
                    status: status,
                    message: message
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
* @description This API is used to update user data
*/
userRoute.post("/update",
    userDataValidator,
    async (req, res) => {
        updateUserData(req.auth, req.body.user)
            .then(data => {
                const { statusCode, status, message } = data;
                return res.status(statusCode).send({
                    status: status,
                    message: message
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
    userRoute
}