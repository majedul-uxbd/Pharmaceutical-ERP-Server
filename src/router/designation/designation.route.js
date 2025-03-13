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
const { designationDataValidator } = require("../../middleware/designation/designation-data-validator");
const { addDesignationData } = require("../../main/designation/add-designation-data");
const { activeDesignation } = require("../../main/designation/active-designation");
const { inactiveDesignation } = require("../../main/designation/inactive-designation");
const { getDesignationData } = require("../../main/designation/get-designation-data");
const { paginationData } = require("../../middleware/pagination-data");
const { updateDesignationData } = require("../../main/designation/update-designation-data");

designationRoute.use(authenticateToken);



/**
* @description This API is used to get Department Information
*/
designationRoute.post("/get-designation-data",
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
* @description This API is used to active designation
*/
designationRoute.post("/active",
    async (req, res) => {
        activeDesignation(req.body.id)
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
* @description This API is used to inactive designation
*/
designationRoute.post("/inactive",
    async (req, res) => {
        inactiveDesignation(req.body.id)
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
* @description This API is used to update designationData
*/
designationRoute.post("/update",
    designationDataValidator,
    async (req, res) => {
        updateDesignationData(req.auth, req.body.designationData)
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