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

const { getModuleData } = require("../../main/common/get-module-data");
const { getDepotData } = require("../../main/common/get-deport-data");
const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { getZoneData } = require("../../main/common/get-zone-data");
const { getRegionData } = require("../../main/common/get-region-data");
const { getMarketData } = require("../../main/common/get-market-data");

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
 * @description This API is used to get depot information
 */
commonRoute.get("/get-depot",
    authenticateToken,
    async (req, res) => {

        getDepotData()
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
 * @description This API is used to get zone information
 */
commonRoute.get("/get-zone",
    authenticateToken,
    async (req, res) => {

        getZoneData()
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
 * @description This API is used to get region information
 */
commonRoute.get("/get-region",
    authenticateToken,
    async (req, res) => {

        getRegionData()
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
* @description This API is used to get market information
*/
commonRoute.get("/get-market",
    authenticateToken,
    async (req, res) => {

        getMarketData()
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

module.exports = {
    commonRoute
}