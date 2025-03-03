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

module.exports = {
    commonRoute
}