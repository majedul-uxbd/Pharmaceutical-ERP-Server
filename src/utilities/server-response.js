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


/**
 * @param {number} code 
 * @param {string} msg 
 * @param {number} [result] 
 * @description This function is used to send messages (success or error) with status code. Optionally includes result.
 */
const setServerResponse = (code, msg, result = null) => {

    // Determine success or error status
    const statusType = code >= 200 && code < 300 ? 'success' : 'failed';

    const response = {
        statusCode: code,
        status: statusType,
        message: msg
    };

    if (result !== null) {
        response.data = result;
    }

    return response;
};


module.exports = {
    setServerResponse
};