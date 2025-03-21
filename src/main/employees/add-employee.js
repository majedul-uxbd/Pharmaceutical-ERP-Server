/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const { pool } = require("../../_DB/db");


const checkIsDataAlreadyExist = async (employeeData) => {
    const _query = `
        SELECT
            employee_id
        FROM 
            employees
        WHERE
            employee_id = ? OR
            email = ?;
    `;

    const _values = [
        employeeData.employee_id,
        employeeData.email
    ]

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        } return false;

    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {
 * employee_id: string
 * } authData 
 * @param {Object} employeeData 
 */
const addEmployee = async (authData, employeeData) => {
    try {
        const isExist = await checkIsDataAlreadyExist(employeeData);


    } catch (error) {

    }
}

module.exports = {
    addEmployee
}