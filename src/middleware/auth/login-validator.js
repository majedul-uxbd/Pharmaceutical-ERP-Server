/**
 * @author Md. Majedul Islam,
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description This middleware is used for Login validation
 * 
 */
const _ = require('lodash');
const { isValidEmail, isValidPassword } = require('../../utilities/user-data-validator');
const { API_STATUS_CODE } = require('../../consts/error-status');


/**
 * @description This function will validate user login data
 */
const loginUserValidation = async (req, res, next) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    if (_.isEmpty(user.email) || _.isEmpty(user.password)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            module: "Email or password is required"
        });
    } else {
        // Check User Information validity
        if (!isValidEmail(user.email)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send({
                status: "failed",
                module: "Invalid email address"
            });
        }

        else if (!isValidPassword(user.password)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send({
                status: "failed",
                module: "Invalid password"
            });
        }
    }

    req.body.user = user;
    next();
}

module.exports = {
    loginUserValidation
}