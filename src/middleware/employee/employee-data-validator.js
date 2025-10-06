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
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");
const { isValidCommonDate, isValidUserFullName, isValidEmail, isValidUserContact } = require("../../utilities/user-data-validator");


const employeeDataValidator = async (req, res, next) => {
    const employeeData = {
        id: req.body.id,
        employee_id: req.body.employee_id,
        full_name: req.body.full_name,
        email: req.body.email,
        contact: req.body.contact,
        present_address: req.body.present_address,
        permanent_address: req.body.permanent_address,
        nid_no: req.body.nid_no,
        joining_date: req.body.joining_date,
        posting_place: req.body.posting_place,
        permanent_date: req.body.permanent_date,
        designation_id: req.body.designation_name,
        department_id: req.body.department_name,
        depot_id: req.body.depot_name,
        module_id: req.body.module_name
    }

    if (req.originalUrl === '/employees/update') {
        if (_.isNil(employeeData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "employee_id_is_required"
                )
            );
        }
    } else {
        delete employeeData.id;
    }

    if (!isValidCommonDate(employeeData.employee_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_id"
            )
        );
    }

    if (!isValidUserFullName(employeeData.full_name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_fullname"
            )
        );
    }

    if (!isValidEmail(employeeData.email)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_email"
            )
        );
    }

    if (!isValidUserContact(employeeData.contact)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_contact"
            )
        );
    }

    if (!isValidCommonDate(employeeData.present_address)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_present_address"
            )
        );
    }

    if (!isValidCommonDate(employeeData.permanent_address)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_permanent_address"
            )
        );
    }

    if (!isValidCommonDate(employeeData.joining_date)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_joining_date"
            )
        );
    }

    if (!isValidCommonDate(employeeData.nid_no)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_nid_no"
            )
        );
    }

    if (!isValidCommonDate(employeeData.posting_place)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_employee_posting_place"
            )
        );
    }

    if (!_.isEmpty(employeeData.permanent_date)) {
        if (!isValidCommonDate(employeeData.permanent_date)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "invalid_employee_permanent_date"
                )
            );
        }
    } else {
        employeeData.permanent_date = null;

    }

    if (!isValidCommonDate(employeeData.module_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_module_name"
            )
        );
    }

    if (!isValidCommonDate(employeeData.depot_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_depot_name"
            )
        );
    }

    if (!isValidCommonDate(employeeData.department_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_department_name"
            )
        );
    }

    if (!isValidCommonDate(employeeData.designation_id)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "invalid_designation_name"
            )
        );
    }

    // console.warn('🚀 ~ employeeDataValidator ~ employeeData:', employeeData);
    req.body.employeeData = employeeData;
    next();
}

module.exports = {
    employeeDataValidator
}