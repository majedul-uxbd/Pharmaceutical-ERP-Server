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
const { isValidDepartmentId, isValidDepartmentName, isValidComment, isValidDesignationShortName } = require('../../utilities/user-data-validator');
const { setServerResponse } = require('../../utilities/server-response');

const designationDataValidator = async (req, res, next) => {
    const designationData = {
        id: req.body.id,
        designation_id: req.body.designation_id,
        designation_code: req.body.designation_code,
        designation_name: req.body.designation_name,
        description: req.body.description,
        comment: req.body.comment,
    }

    if (req.originalUrl === '/designation/update') {
        if (_.isNil(designationData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "designation_id_is_required"
                )
            );
        }
    } else {
        delete designationData.id;
    }

    if (!isValidDepartmentId(designationData.designation_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_designation_id"
            )
        );
    }
    if (!isValidDepartmentId(designationData.designation_code)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_designation_code"
            )
        );
    }
    if (!isValidDepartmentName(designationData.designation_name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_designation_name"
            )
        );
    }

    // console.warn('🚀 ~ designationDataValidator ~ departmentData:', designationData);
    req.body.designationData = designationData;
    next();
}



module.exports = {
    designationDataValidator
}