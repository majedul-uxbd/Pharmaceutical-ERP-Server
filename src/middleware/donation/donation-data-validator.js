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
const { isValidUserFullName, isValidEmail, isValidUserContact, isValidUserAddress, isValidUserOccupation, isValidUserDonationField, isValidUserAmount, isValidTransactionId } = require('../../utilities/user-data-validator');

const donationDataValidator = async (req, res, next) => {
    const donationData = {
        fullName: req.body.fullName,
        email: req.body.email,
        contact: req.body.contact,
        address: req.body.address,
        occupation: req.body.occupation,
        donation_field: req.body.donation_field,
        amount: req.body.amount,
        transactionId: req.body.transactionId,
        comment: req.body.comment
    }

    if (!isValidUserFullName(donationData.fullName)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user name",
        });
    }
    if (!isValidEmail(donationData.email)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user email address",
        });
    }
    if (!isValidUserContact(donationData.contact)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user contact number",
        });
    }
    if (!isValidUserAddress(donationData.address)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user address",
        });
    }
    if (!isValidUserOccupation(donationData.occupation)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user occupation",
        });
    }
    if (!isValidUserDonationField(donationData.donation_field)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user donation field",
        });
    }
    if (!isValidUserAmount(donationData.amount)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid user amount",
        });
    }
    if (!isValidTransactionId(donationData.transactionId)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send({
            status: "failed",
            message: "Invalid transaction ID",
        });
    }

    // console.warn('🚀 ~ file: donation-data-validator.js:28 ~ donationDataValidator ~ donationData:', donationData);
    req.body.donationData = donationData;
    next();
}

module.exports = {
    donationDataValidator
}