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
const { isValidDepartmentId, isValidDepartmentName } = require('../../utilities/user-data-validator');
const { setServerResponse } = require('../../utilities/server-response');

const marketDataValidator = async (req, res, next) => {
    const marketData = {
        id: req.body.id,
        market_id: req.body.market_id,
        market_code: req.body.market_code,
        market_name: req.body.market_name,
        zone_id: req.body.zone_name,
        comment: req.body.comment,
    }

    if (req.originalUrl === '/market/update') {
        if (_.isNil(marketData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'market_id_is_required',
                )
            );
        }
    } else {
        delete marketData.id;
    }

    if (!isValidDepartmentId(marketData.market_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_market_id',
            )
        );
    }
    if (!isValidDepartmentId(marketData.market_code)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_market_code',
            )
        );
    }
    if (!isValidDepartmentName(marketData.market_name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_market_name',
            )
        );
    }
    if (!isValidDepartmentId(marketData.zone_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_region_name',
            )
        );
    }

    // console.warn('🚀 ~ marketDataValidator ~ departmentData:', marketData);
    req.body.marketData = marketData;
    next();
}



module.exports = {
    marketDataValidator
}