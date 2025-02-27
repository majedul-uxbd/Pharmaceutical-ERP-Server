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
const { addDepartmentData } = require("../../main/department/add-department-data");
const { inactiveDepartment } = require("../../main/department/inactive-department");
const { activeDepartment } = require("../../main/department/active-department");

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
* @description This API is used to inactive department
*/
departmentRoute.post("/active",
    async (req, res) => {
        activeDepartment(req.body.id)
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
* @description This API is used to inactive department
*/
departmentRoute.post("/inactive",
    async (req, res) => {
        inactiveDepartment(req.body.id)
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