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
const idCountRoute = express.Router();

const { getMarketIdCount } = require("../../main/id-count/get-market-id-count");
const { getRegionIdCount } = require("../../main/id-count/get-region-id-count");
const { getZoneIdCount } = require("../../main/id-count/get-zone-id-count");


/**
 * @description This API is used to get the zone id and code count
 */
idCountRoute.get('/get-zone-id-count',
    async (req, res) => {
        getZoneIdCount()
            .then(data1 => {
                const { statusCode, status, message, data } = data1;
                return res.status(statusCode).send({
                    status: status,
                    message: message,
                    data: data
                });
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                });
            });
    }
)

/**
 * @description This API is used to get the region id and code count
 */
idCountRoute.get('/get-region-id-count',
    async (req, res) => {
        getRegionIdCount()
            .then(data1 => {
                const { statusCode, status, message, data } = data1;
                return res.status(statusCode).send({
                    status: status,
                    message: message,
                    data: data
                });
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                });
            });
    }
)

/**
 * @description This API is used to get the market id and code count
 */
idCountRoute.get('/get-market-id-count',
    async (req, res) => {
        getMarketIdCount()
            .then(data1 => {
                const { statusCode, status, message, data } = data1;
                return res.status(statusCode).send({
                    status: status,
                    message: message,
                    data: data
                });
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                });
            });
    }
)


module.exports = {
    idCountRoute
}