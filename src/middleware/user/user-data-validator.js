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

const _ = require('lodash');
const { isValidUserFirstName,
    isValidUserLastName,
    isValidEmail,
    isValidUserContact,
    isValidUserAddress,
} = require('../../utilities/user-data-validator');
const { API_STATUS_CODE } = require('../../consts/error-status');


/**
 * This function will validate user data
 */
const userDataValidator = (req, res, next) => {
    const userData = {
        id: req.body.id,
        firstName: req.body.f_name,
        lastName: req.body.l_name,
        contact: req.body.contact_no,
        address: req.body.address,
    };

    if (!isValidUserFirstName(userData.firstName)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user first name",
        });
    }

    if (!isValidUserLastName(userData.lastName)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user last name",
        });
    }

    if (!isValidUserContact(userData.contact)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user contact",
        });
    }

    if (!isValidUserAddress(userData.address)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user address",
        });
    }
    req.body.user = userData;
    next();
};

module.exports = {
    userDataValidator,
};
