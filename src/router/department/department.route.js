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
const departmentRoute = express.Router();

const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { departmentDataValidator } = require("../../middleware/donation/department-data-validator");
const { paginationData } = require("../../middleware/pagination-data");
const { addDepartmentData } = require("../../main/department/add-department-data");

departmentRoute.use(authenticateToken);


/**
 * @description This API is used to create new department
 */
departmentRoute.post("/add-department",
    departmentDataValidator,
    async (req, res) => {
        addDepartmentData(req.auth, req.body.departmentData)
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
* @description This API is used to register new users
*/
departmentRoute.post("/get-donation-data",
    paginationData,
    async (req, res) => {

        getDonationData(req.auth, req.body.paginationData)
            .then(data1 => {
                // console.log('🚀 ~ file: donation.route.js:69 ~ data1:', data1);
                const { statusCode, status, message, data } = data1;
                return res.status(statusCode).send({
                    status: status,
                    message: message,
                    ...data
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
* @description This API is used to register new users
*/
departmentRoute.post("/delete",
    async (req, res) => {
        deleteDonationData(req.body.id)
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
    departmentRoute
}