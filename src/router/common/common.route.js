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
const commonRoute = express.Router();

const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { getModuleData } = require("../../main/common/get-module-data");
const { getDepartmentData } = require("../../main/common/get-department-data");
const { paginationData } = require("../../middleware/pagination-data");
const { deleteDonationData, getDesignationData } = require("../../main/common/get-designation-data");

// commonRoute.use(authenticateToken);


/**
 * @description This API is used to get module information
 */
commonRoute.get("/get-module",
    async (req, res) => {

        getModuleData()
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
* @description This API is used to get Department Information
*/
commonRoute.post("/get-department-data",
    paginationData,
    async (req, res) => {

        getDepartmentData(req.body.paginationData)
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
    });


/**
* @description This API is used to get Department Information
*/
commonRoute.post("/get-designation-data",
    paginationData,
    async (req, res) => {

        getDesignationData(req.body.paginationData)
            .then(data1 => {
                // console.log('🚀 ~ file: designation.route.js:69 ~ data1:', data1);
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
    });

module.exports = {
    commonRoute
}