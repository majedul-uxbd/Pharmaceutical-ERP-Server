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

const { pool } = require("../../_DB/db");
const { TABLE_DEPARTMENT_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-department-column-name");
const { TABLE_DEPOT_INFO_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-depot-info-column-name");
const { TABLE_DESIGNATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-designation-column-name");
const { TABLE_EMPLOYEES_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-employee-column-name");
const { TABLE_MODULE_INFORMATION_COLUMNS_NAME } = require("../../_DB/DB-table-info/table-module-information-column-name");
const { TABLES } = require("../../_DB/DB-table-info/tables-name.const");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../utilities/server-response");

const getUserDataQuery = async (authData) => {
    const query = `
    SELECT
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.ID},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.Full_NAME},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.USERNAME},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.EMAIL},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.CONTACT},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.PERMANENT_ADDRESS},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.PERMANENT_ADDRESS},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.JOINING_DATE},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.POSTING_PLACE},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.PERMANENT_DATE},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.NID_NO},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPARTMENT_ID},
        dept.${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_NAME},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPORT_ID},
        df.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_NAME},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.MODULE_ID},
        mf.${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_NAME},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID},
        d.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_NAME},
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.PROFILE_PIC}
    FROM
        ${TABLES.TBL_Employees} AS e
    LEFT JOIN ${TABLES.TBL_DEPARTMENT} AS dept
    ON
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPARTMENT_ID} = dept.${TABLE_DEPARTMENT_COLUMNS_NAME.DEPARTMENT_ID}
    LEFT JOIN ${TABLES.TBL_DESIGNATION} AS d
    ON
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID} = d.${TABLE_DESIGNATION_COLUMNS_NAME.DESIGNATION_ID}
    LEFT JOIN ${TABLES.TBL_DEPORT_INFO} AS df
    ON
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPORT_ID} = df.${TABLE_DEPOT_INFO_COLUMNS_NAME.DEPOT_ID}
    LEFT JOIN ${TABLES.TBL_MODULE_INFO} AS mf
    ON
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.MODULE_ID} = mf.${TABLE_MODULE_INFORMATION_COLUMNS_NAME.MODULE_ID}
    WHERE
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.EMPLOYEE_ID} = ? AND
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DESIGNATION_ID} = ? AND
        e.${TABLE_EMPLOYEES_COLUMNS_NAME.DEPORT_ID} = ?;
    `;

    const values = [
        authData.employee_id,
        authData.designation_id,
        authData.depot_id
    ]

    try {
        const [result] = await pool.query(query, values);
        if (result.length > 0) {
            return result[0];
        }
        return false;
    } catch (error) {
        return error
    }
}

/**
 * @param {{
* employee_id: string,
* designation_id: string,
* depot_id: string,
* }} authData 
@description This function retrieves user data based on the provided authentication data.
 */
const getUserData = async (authData) => {
    try {
        const userData = await getUserDataQuery(authData);
        if (!userData) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'user_not_found'
                )
            );
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                userData
            )
        );
    } catch (error) {
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error'
            )
        );
    }
}


module.exports = {
    getUserData
}