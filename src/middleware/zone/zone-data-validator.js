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

const zoneDataValidator = async (req, res, next) => {
    // console.log({ data: req.body });
    const zoneData = {
        id: req.body.id,
        zone_code: req.body.zone_code,
        zone_name: req.body.zone_name,
        depot_id: req.body.depot_name,
        comment: req.body.comment,
    }

    if (req.originalUrl === '/zone/update') {
        if (_.isNil(zoneData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send({
                status: "failed",
                message: "Zone ID is required",
            });
        }
    } else {
        delete zoneData.id;
    }

    if (!isValidDepartmentId(zoneData.zone_code)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid zone code",
        });
    }
    if (!isValidDepartmentName(zoneData.zone_name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid zone name",
        });
    }
    if (!isValidDepartmentId(zoneData.depot_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid depot ID",
        });
    }

    // console.warn('🚀 ~ zoneDataValidator ~ departmentData:', zoneData);
    req.body.zoneData = zoneData;
    next();
}



module.exports = {
    zoneDataValidator
}