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
const { paginationData } = require("../../middleware/pagination-data");
const { getZoneData } = require("../../main/zone/get-zone-data");
const { zoneDataValidator } = require("../../middleware/zone/zone-data-validator");
const { addZoneData } = require("../../main/zone/add-zone-data");
const { activeZone } = require("../../main/zone/active-zone");
const { inactiveZone } = require("../../main/zone/inactive-zone");
const { updateZoneData } = require("../../main/zone/update-zone-data");

zoneRoute.use(authenticateToken);



/**
* @description This API is used to get Zone Information
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
* @description This API is used to active zone
*/
zoneRoute.post("/active",
    async (req, res) => {
        activeZone(req.body.id, req.auth)
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
* @description This API is used to inactive Zone
*/
zoneRoute.post("/inactive",
    async (req, res) => {
        inactiveZone(req.body.id, req.auth)
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
* @description This API is used to update zoneData
*/
zoneRoute.post("/update",
    zoneDataValidator,
    async (req, res) => {
        updateZoneData(req.body.zoneData, req.auth)
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