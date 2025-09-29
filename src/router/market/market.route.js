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
const { getMarketData } = require("../../main/market/get-market-data");
const { marketDataValidator } = require("../../middleware/market/market-data-validator");
const { addMarketData } = require("../../main/market/add-market-data");
const { activeMarket } = require("../../main/market/active-market");
const { inactiveMarket } = require("../../main/market/inactive-market");
const { updateMarketData } = require("../../main/market/update-market-data");

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
        addMarketData(req.body.marketData, req.auth)
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
        const authData = req.auth;
        activeMarket(req.body.id, authData)
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
        const authData = req.auth;
        inactiveMarket(req.body.id, authData)
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
* @description This API is used to update marketData
*/
marketRoute.post("/update",
    marketDataValidator,
    async (req, res) => {
        updateMarketData(req.body.marketData)
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