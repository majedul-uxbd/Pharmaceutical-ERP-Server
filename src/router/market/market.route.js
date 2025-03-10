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
const marketRoute = express.Router();

const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { paginationData } = require("../../middleware/pagination-data");
const { getZoneData } = require("../../main/zone/get-zone-data");
const { zoneDataValidator } = require("../../middleware/zone/zone-data-validator");
const { addZoneData } = require("../../main/zone/add-zone-data");
const { activeZone } = require("../../main/zone/active-zone");
const { inactiveZone } = require("../../main/zone/inactive-zone");
const { updateZoneData } = require("../../main/zone/update-zone-data");
const { getMarketData } = require("../../main/market/get-market-data");
const { marketDataValidator } = require("../../middleware/market/market-data-validator");
const { addMarketData } = require("../../main/market/add-market-data");

marketRoute.use(authenticateToken);



/**
* @description This API is used to get Zone Information
*/
marketRoute.post("/get-market-data",
    paginationData,
    async (req, res) => {

        getMarketData(req.body.paginationData)
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
 * @description This API is used to create new market
 */
marketRoute.post("/add-market",
    marketDataValidator,
    async (req, res) => {
        addMarketData(req.body.marketData)
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
marketRoute.post("/active",
    async (req, res) => {
        activeZone(req.body.id)
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
marketRoute.post("/inactive",
    async (req, res) => {
        inactiveZone(req.body.id)
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
marketRoute.post("/update",
    zoneDataValidator,
    async (req, res) => {
        updateZoneData(req.body.zoneData)
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
    marketRoute
}