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
const { setServerResponse } = require('../../utilities/server-response');

const departmentDataValidator = async (req, res, next) => {
    const departmentData = {
        id: req.body.id,
        department_id: req.body.department_id,
        department_code: req.body.department_code,
        department_name: req.body.department_name,
        comment: req.body.comment,
    }

    if (req.originalUrl === '/department/update') {
        if (_.isNil(departmentData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "department_id_is_required"
                )
            );
        }
    } else {
        delete departmentData.id;
    }

    if (!isValidDepartmentId(departmentData.department_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_department_id"
            )
        );
    }
    if (!isValidDepartmentId(departmentData.department_code)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_department_code"
            )
        );
    }
    if (!isValidDepartmentName(departmentData.department_name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_department_name"
            )
        );
    }

    // console.warn('🚀 ~ departmentDataValidator ~ departmentData:', departmentData);
    req.body.departmentData = departmentData;
    next();
}



module.exports = {
    departmentDataValidator
}