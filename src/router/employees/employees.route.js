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

module.exports = {
    employeeRoute
}