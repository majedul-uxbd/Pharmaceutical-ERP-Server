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
    isValidPassword,
    isValidUserAddress,
} = require('../../utilities/user-data-validator');
const { API_STATUS_CODE } = require('../../consts/error-status');


/**
 * This function will validate user data
 */
const signupDataValidator = (req, res, next) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contact: req.body.contact,
        address: req.body.address,
        role: req.body.role,
        password: req.body.password,
        profileImg: req.body.profileImg,
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

    if (!isValidEmail(userData.email)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user email address",
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

    // set user default role
    userData.role = 'user';

    if (!isValidPassword(userData.password)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user password",
        });
    }
    req.body.user = userData;
    next();
};

module.exports = {
    signupDataValidator,
};
