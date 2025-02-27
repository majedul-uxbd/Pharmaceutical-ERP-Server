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
const { API_STATUS_CODE } = require('../../consts/error-status');
const { isValidDepartmentId, isValidDepartmentName, isValidComment } = require('../../utilities/user-data-validator');

const departmentDataValidator = async (req, res, next) => {
    const departmentData = {
        department_id: req.body.department_id,
        department_name: req.body.department_name,
        comment: req.body.comment,
    }

    if (!isValidDepartmentId(departmentData.department_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid department ID",
        });
    }
    if (!isValidDepartmentName(departmentData.department_name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid department name",
        });
    }
    // if (!isValidComment(departmentData.comment)) {
    //     return res.status(API_STATUS_CODE.BAD_REQUEST).send({
    //         status: "failed",
    //         message: "Maximum 500 characters allowed",
    //     });
    // }

    // console.warn('🚀 ~ departmentDataValidator ~ departmentData:', departmentData);
    req.body.departmentData = departmentData;

    next();
}

module.exports = {
    departmentDataValidator
}