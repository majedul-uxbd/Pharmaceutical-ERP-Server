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
const employeeRoute = express.Router();

const { paginationData } = require("../../middleware/pagination-data");
const { getEmployeesData } = require("../../main/employees/get-employees-data");
const { activeEmployees } = require("../../main/employees/active-employee");
const { inactiveEmployees } = require("../../main/employees/inactive-employee");
const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { employeeDataValidator } = require("../../middleware/employee/employee-data-validator");
const { addEmployee } = require("../../main/employees/add-employee");
const { updateEmployeeData } = require("../../main/employees/update-employee-data");

employeeRoute.use(authenticateToken);


/**
* @description This API is used to get Employee information
*/
employeeRoute.post('/get-employees-data',
    paginationData,
    async (req, res) => {
        getEmployeesData(req.body.paginationData)
            .then(result => {
                const { statusCode, status, message, data } = result;
                return res.status(statusCode).send({
                    status: status,
                    message: message,
                    data: data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    }
);

/**
* @description This API is used to get Employee information
*/
employeeRoute.post('/add-employee',
    employeeDataValidator,
    async (req, res) => {
        addEmployee(req.auth, req.body.employeeData)
            .then(result => {
                const { statusCode, status, message } = result;
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
    }
);

/**
* @description This API is used to active Employee
*/
employeeRoute.post("/active",
    async (req, res) => {
        activeEmployees(req.body.id)
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
* @description This API is used to inactive Employee
*/
employeeRoute.post("/inactive",
    async (req, res) => {
        inactiveEmployees(req.body.id)
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
* @description This API is used to update Employee information
*/
employeeRoute.post("/update",
    employeeDataValidator,
    async (req, res) => {
        updateEmployeeData(req.auth, req.body.employeeData)
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
    employeeRoute
}