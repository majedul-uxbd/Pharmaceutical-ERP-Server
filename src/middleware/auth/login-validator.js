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
const { isValidPassword, isValidUsername } = require('../../utilities/user-data-validator');
const { API_STATUS_CODE } = require('../../consts/error-status');
const { setServerResponse } = require('../../utilities/server-response');


/**
 * @description This function will validate user login data
 */
const loginUserValidation = async (req, res, next) => {
    const user = {
        module_id: req.body.module_name,
        username: req.body.username,
        password: req.body.password
    }

    if (_.isEmpty(user.module_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'module_name_is_required',
            )
        );
    }

    if (_.isEmpty(user.username) || _.isEmpty(user.password)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'username_or_password_is_required',
            )
        );
    } else {
        // Check User Information validity
        if (!isValidUsername(user.username)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_username',
                )
            );
        }

        else if (!isValidPassword(user.password)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_password',
                )
            );
        }
    }

    req.body.user = user;
    next();
}

module.exports = {
    loginUserValidation
}