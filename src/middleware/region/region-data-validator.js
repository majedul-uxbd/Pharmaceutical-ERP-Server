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

const regionDataValidator = async (req, res, next) => {
    const regionData = {
        id: req.body.id,
        region_id: req.body.region_id,
        region_code: req.body.region_code,
        region_name: req.body.region_name,
        zone_id: req.body.zone_name,
        comment: req.body.comment,
    }

    if (req.originalUrl === '/region/update') {
        if (_.isNil(regionData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'regionId_id_is_required',
                )
            );
        }
    } else {
        delete regionData.id;
    }

    if (req.originalUrl === '/region/add-region') {
        if (!isValidDepartmentId(regionData.region_id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_region_id',
                )
            );
        }
        if (!isValidDepartmentId(regionData.region_code)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_region_code',
                )
            );
        }
    } else {
        delete regionData.region_id;
        delete regionData.region_code;
    }
    if (!isValidDepartmentName(regionData.region_name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_region_name',
            )
        );
    }
    if (!isValidDepartmentId(regionData.zone_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_zone_name',
            )
        );
    }

    // console.warn('🚀 ~ regionDataValidator ~ departmentData:', regionData);
    req.body.regionData = regionData;
    next();
}



module.exports = {
    regionDataValidator
}