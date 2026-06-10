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
const { paginationData } = require('../../middleware/pagination-data');
const { getBreakupTableData } = require('../../main/breakup/get-breakup-table-data');
const { getBreakupList } = require('../../main/breakup/get-breakup-list');
const breakupRouter = express.Router();

breakupRouter.use(authenticateToken);


/**
* @description This API is used to get Breakup element table data
*/
breakupRouter.post('/table-data',
    paginationData,
    async (req, res) => {
        getBreakupTableData(req.body.paginationData)
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
* @description This API is used to get Breakup list (ID and name)
*/
breakupRouter.get('/breakup-list',
    async (req, res) => {
        getBreakupList()
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
    });

module.exports = {
    breakupRouter
}