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

employeeRoute.use(authenticateToken);


/**
* @description This API is used to get Employee information
*/
employeeRoute.post('/get-employees-data',
    paginationData,
    async (req, res) => {
        getEmployeesData(req.body.paginationData)
            .then(data1 => {
                const { statusCode, status, message, data } = data1;
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
employeeRoute.post('/add-employees',
    async (req, res) => {
        addEmployees()
            .then(data1 => {
                const { statusCode, status, message } = data1;
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


module.exports = {
    employeeRoute
}