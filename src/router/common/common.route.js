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
const { getModuleData } = require("../../main/donation/get-module-data");
const { getDonationData } = require("../../main/donation/get-donation-data");
const { paginationData } = require("../../middleware/pagination-data");
const { deleteDonationData } = require("../../main/donation/delete-donation-data");

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
* @description This API is used to register new users
*/
commonRoute.post("/get-donation-data",
    paginationData,
    async (req, res) => {

        getDonationData(req.auth, req.body.paginationData)
            .then(data1 => {
                // console.log('🚀 ~ file: donation.route.js:69 ~ data1:', data1);
                const { statusCode, status, message, data } = data1;
                return res.status(statusCode).send({
                    status: status,
                    message: message,
                    ...data
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
* @description This API is used to register new users
*/
commonRoute.post("/delete",
    async (req, res) => {
        deleteDonationData(req.body.id)
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
    commonRoute
}