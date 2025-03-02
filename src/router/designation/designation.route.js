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
const designationRoute = express.Router();

const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { departmentDataValidator } = require("../../middleware/department/department-data-validator");
const { addDepartmentData } = require("../../main/department/add-department-data");
const { inactiveDepartment } = require("../../main/department/inactive-department");
const { activeDepartment } = require("../../main/department/active-department");
const { updateDepartmentData } = require("../../main/department/update-department-data");
const { designationDataValidator } = require("../../middleware/designation/designation-data-validator");
const { addDesignationData } = require("../../main/designation/add-designation-data");

designationRoute.use(authenticateToken);


/**
 * @description This API is used to create new designation
 */
designationRoute.post("/add-designation",
    designationDataValidator,
    async (req, res) => {
        addDesignationData(req.auth, req.body.designationData)
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
* @description This API is used to active department
*/
designationRoute.post("/active",
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
designationRoute.post("/inactive",
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

/**
* @description This API is used to update departmentData
*/
designationRoute.post("/update",
    departmentDataValidator,
    async (req, res) => {
        updateDepartmentData(req.auth, req.body.departmentData)
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
    designationRoute
}