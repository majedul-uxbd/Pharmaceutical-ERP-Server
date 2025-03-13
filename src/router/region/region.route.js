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
const regionRoute = express.Router();

const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { paginationData } = require("../../middleware/pagination-data");
const { getRegionData } = require("../../main/region/get-region-data");
const { regionDataValidator } = require("../../middleware/region/region-data-validator");
const { addRegionData } = require("../../main/region/add-region-data");
const { inactiveRegion } = require("../../main/region/inactive-region");
const { activeRegion } = require("../../main/region/active-region");
const { updateRegionData } = require("../../main/region/update-region-data");

regionRoute.use(authenticateToken);



/**
* @description This API is used to get Region Information
*/
regionRoute.post("/get-region-data",
    paginationData,
    async (req, res) => {

        getRegionData(req.body.paginationData)
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
 * @description This API is used to create new region
 */
regionRoute.post("/add-region",
    regionDataValidator,
    async (req, res) => {
        addRegionData(req.body.regionData)
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
* @description This API is used to active Region
*/
regionRoute.post("/active",
    async (req, res) => {
        activeRegion(req.body.id)
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
* @description This API is used to inactive Region
*/
regionRoute.post("/inactive",
    async (req, res) => {
        inactiveRegion(req.body.id)
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
* @description This API is used to update region data
*/
regionRoute.post("/update",
    regionDataValidator,
    async (req, res) => {
        updateRegionData(req.body.regionData)
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
    regionRoute
}