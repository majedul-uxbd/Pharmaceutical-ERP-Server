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


const employeeDataValidator = async (req, res, next) => {
    const employeeData = {
        employee_id: req.body.employee_id,
        full_name: req.body.full_name,
        email: req.body.email,
        contact: req.body.contact,
        present_address: req.body.present_address,
        permanent_address: req.body.permanent_address,
        joining_date: req.body.joining_date,
        posting_place: req.body.posting_place,
        Permanent_date: req.body.Permanent_date,
        designation_name: req.body.designation_name,
        department_name: req.body.department_name,
        depot_name: req.body.depot_name,
        module_name: req.body.module_name
    }


    req.body.employeeData = employeeData;
    next();
}

module.exports = {
    employeeDataValidator
}