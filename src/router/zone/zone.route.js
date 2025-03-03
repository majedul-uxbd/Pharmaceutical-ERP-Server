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
const zoneRoute = express.Router();

const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { designationDataValidator } = require("../../middleware/designation/designation-data-validator");
const { addDesignationData } = require("../../main/designation/add-designation-data");
const { activeDesignation } = require("../../main/designation/active-designation");
const { inactiveDesignation } = require("../../main/designation/inactive-department");
const { getDesignationData } = require("../../main/designation/get-designation-data");
const { paginationData } = require("../../middleware/pagination-data");
const { updateDesignationData } = require("../../main/designation/update-designation-data");
const { getZoneData } = require("../../main/zone/get-zone-data");
const { zoneDataValidator } = require("../../middleware/zone/zone-data-validator");
const { addZoneData } = require("../../main/zone/add-zone-data");

zoneRoute.use(authenticateToken);



/**
* @description This API is used to get Department Information
*/
zoneRoute.post("/get-zone-data",
    paginationData,
    async (req, res) => {

        getZoneData(req.body.paginationData)
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
 * @description This API is used to create new zone
 */
zoneRoute.post("/add-zone",
    zoneDataValidator,
    async (req, res) => {
        addZoneData(req.auth, req.body.zoneData)
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
zoneRoute.post("/active",
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
zoneRoute.post("/inactive",
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
zoneRoute.post("/update",
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
    zoneRoute
}