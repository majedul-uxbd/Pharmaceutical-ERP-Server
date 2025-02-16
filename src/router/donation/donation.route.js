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
const donationRoute = express.Router();

const { authenticateToken } = require("../../middleware/auth-token/authenticate-token");
const { donationDataValidator } = require("../../middleware/donation/donation-data-validator");
const { addDonationData } = require("../../main/donation/add-donation-data");
const { getDonationData } = require("../../main/donation/get-donation-data");
const { paginationData } = require("../../middleware/pagination-data");
const { deleteDonationData } = require("../../main/donation/delete-donation-data");

donationRoute.use(authenticateToken);


/**
 * @description This API is used to register new users
 */
donationRoute.post("/add-donation",
    donationDataValidator,
    async (req, res) => {

        addDonationData(req.body.donationData, req.auth)
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
* @description This API is used to register new users
*/
donationRoute.post("/get-donation-data",
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
donationRoute.post("/delete",
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
    donationRoute
}