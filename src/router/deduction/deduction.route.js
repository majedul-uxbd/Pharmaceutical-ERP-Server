/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const express = require('express');
const { authenticateToken } = require('../../middleware/auth-token/authenticate-token');
const { getDeductionTableData } = require('../../main/deduction/get-deduction-table-data');
const deductionRouter = express.Router();

deductionRouter.use(authenticateToken);


/**
* @description This API is used to get Employee information
*/
deductionRouter.post('/table-data',
    paginationData,
    async (req, res) => {
        getDeductionTableData(req.body.paginationData)
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
deductionRouter.post('/add-employee',
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

module.exports = {
    deductionRouter
}