/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const { API_STATUS_CODE } = require("../../consts/error-status");


const USER_ROLE = Object.freeze({
    ADMIN: "admin"
});


const validateUserRoleBasedAccess = (req, res, next) => {
    const userRole = req.auth?.role;

    if (!userRole) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "user_role_is_not_defined"
        });
    }

    if (userRole !== USER_ROLE.ADMIN) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "access_denied_insufficient_permissions"
        });
    }

    next();
}