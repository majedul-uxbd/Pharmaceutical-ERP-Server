/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */

const bcrypt = require("bcrypt");
const { pool } = require("../../_DB/db");
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");


const checkDuplicateEmail = async (email) => {
    const _query = `
    SELECT 
        email
    FROM
        user
    WHERE
        email = ?;
`;

    const _values = [
        email
    ];

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        // console.log("🚀 ~ userLoginQuery ~ error:", error)
        return Promise.reject(error);
    }
};

const insertUserQuery = async (userData) => {
    const query = `
	INSERT INTO
        user
        (
            f_name,
            l_name,
            email,
            contact_no,
            address,
            role,
            password,
            profile_img,
            created_at
        )
	VALUES (?,?,?,?,?,?,?,?,?);
	`;

    const values = [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.contact,
        userData.address,
        userData.role,
        userData.password,
        userData.profileImg,
        userData.createdAt
    ];

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows > 0) {
            return true;
        }
        return false;
    } catch (error) {
        // console.log("🚀 ~ userLoginQuery ~ error:", error)
        return Promise.reject(error);
    }
};

/**
 * @description This function is used to add visitor data 
 */
const userSignup = async (userData) => {

    const createdAt = new Date();
    const password = userData.password;

    let _password;
    try {
        const isDuplicateEmail = await checkDuplicateEmail(userData.email);
        if (isDuplicateEmail) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'Email has already existed'
                )
            );
        }
        _password = await bcrypt.hash(password, 10);
        const userNewData = { ...userData, password: _password, createdAt: createdAt };

        const insertedData = await insertUserQuery(userNewData);
        // if (insertedData) {
        //     // console.warn('🚀 ~ file: user-signup.js:107 ~ userSignup ~ insertedData:', insertedData);
        //     await sendMail(
        //         `Donation Collection System(DCS) <support@assunnahfoundation.org>`,
        //         userData.email,
        //         `Your Account Has Been Created`,
        //         `<!DOCTYPE html>
        //         <html>
        //             <head>
        //                 <meta charset="utf-8">
        //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //                 <title>Your Account Details</title>
        //             </head>
        //             <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Arial', sans-serif;">
        //                 <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
        //                     <!-- Header -->
        //                     <div style="background-color: #1e3a8a; padding: 30px 40px; text-align: center;">
        //                         <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
        //                             Your Account Details
        //                         </h1>
        //                     </div>

        //                     <!-- Main Content -->
        //                     <div style="padding: 40px; background-color: #ffffff;">
        //                         <!-- Greeting -->
        //                         <div style="margin-bottom: 30px;">
        //                             <p style="font-size: 16px; color: #333333; margin: 0;">Hello ${visitorData.firstName} ${visitorData.lastName},</p>
        //                         </div>

        //                         <!-- Success Message -->
        //                         <div style="background-color: #f0f9ff; border-left: 4px solid #1e3a8a; padding: 20px; margin-bottom: 30px;">
        //                             <p style="margin: 0; color: #1e3a8a; font-size: 16px;">
        //                                 🎉 Your account has been successfully created!. Below are your login credentials.
        //                             </p>
        //                         </div>

        //                         <!-- Login Details -->
        //                         <div style="margin-bottom: 30px;">
        //                             <h2 style="color: #1e3a8a; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
        //                                 Your Login Credentials
        //                             </h2>
        //                             <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
        //                                 <table style="width: 100%; border-collapse: collapse;">
        //                                     <tr>
        //                                         <td style="padding: 5px; width: 100px; color: #64748b; font-size: 14px;">Email:</td>
        //                                         <td style="padding: 5px; color: #333333; font-size: 14px;">${visitorData.email}</td>
        //                                     </tr>
        //                                     <tr>
        //                                         <td style="padding: 5px; color: #64748b; font-size: 14px;">Password:</td>
        //                                         <td style="padding: 5px; color: #333333; font-size: 14px;">${password}</td>
        //                                     </tr>
        //                                 </table>
        //                             </div>
        //                         </div>

        //                         <div style="text-align: center; margin: 20px 0;">
        //                             <a href="${loginUrl}" style="display: inline-block; padding: 12px 25px; background-color: #1e3a8a; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
        //                         </div>

        //                         <!-- Support Section -->
        //                         <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
        //                             <p style="margin: 0; color: #64748b; font-size: 14px;">
        //                                 <strong style="color: #1e3a8a;">Need Help?</strong><br>
        //                                 If you have any questions or need assistance, our support team is here to help.
        //                             </p>
        //                         </div>
        //                     </div>

        //                     <!-- Footer -->
        //                     <div style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
        //                         <p style="margin: 0; color: #64748b; font-size: 14px;">Best Regards,<br><a href='www.assunnahfoundation.org'>As-Sunnah Foundation</a></p>
        //                         <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        //                             <p style="margin: 0; color: #94a3b8; font-size: 12px;">
        //                                 This is an automated message, please do not reply directly to this email.
        //                             </p>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </body>
        //         </html>`
        //     );
        // }
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'You have successfully signed up'
            )
        )


    } catch (error) {
        // console.log("🚀 ~ addUser ~ error:", error)
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lgKey,
            )
        )
    }
}

module.exports = {
    userSignup
}