/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd>
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 *
 * @description This file is used for username, email and password validation.
 *
 */

const _ = require("lodash");

const VALID_USER_ROLE_TYPE = Object.freeze({
	Admin: "admin",
	User: "user"
});


/**
 * @description Validate username
 */
const isValidUsername = (username) => {
	const USERNAME_MAX_LENGTH = 60;
	const USERNAME_MIN_LENGTH = 4;
	if (_.isEmpty(username)) {
		return false;
	} else {
		if (!_.isString(username)) {
			return false;
		} else {
			// check length
			if (
				username.length > USERNAME_MAX_LENGTH ||
				username.length < USERNAME_MIN_LENGTH
			) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @description Validate user full name 
 */
const isValidUserFullName = (fullName) => {
	const FULLNAME_MAX_LENGTH = 100;
	const FULLNAME_MIN_LENGTH = 4;
	if (_.isEmpty(fullName)) {
		return false;
	} else {
		if (!_.isString(fullName)) {
			return false;
		} else {
			// check length
			if (
				fullName.length > FULLNAME_MAX_LENGTH ||
				fullName.length < FULLNAME_MIN_LENGTH
			) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @description Validate user role
 */
const isValidUserRole = (role) => {
	if (_.isEmpty(role)) {
		return false;
	} else {
		if (!Object.values(VALID_USER_ROLE_TYPE).includes(role)) {
			return false;
		}
	}
	return true;
};

/**
 * @description Validate user email
 */
const isValidEmail = (email) => {
	if (_.isEmpty(email)) {
		return false;
	} else {
		if (
			!email.match(
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			return false;
		}
	}
	return true;
};

/**
 * @description Validate user password
 */
const isValidPassword = (password) => {
	const USERNAME_MAX_LENGTH = 120;
	const USERNAME_MIN_LENGTH = 4;
	// Regex to enforce the following rules:
	// - At least one lowercase letter
	// - At least one uppercase letter
	// - At least one digit
	// - At least one special character among @$!%*?&
	// - Minimum length of 8 characters
	// - Maximum length of 60 characters
	// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,60}$/;
	if (_.isEmpty(password)) {
		return false;
	} else {
		if (
			password.length > USERNAME_MAX_LENGTH ||
			password.length < USERNAME_MIN_LENGTH
		) {
			return false;
		}
	}
	return true;
};

/**
 * @description Validate user contact information
 */
const isValidUserContact = (contact) => {
	const CONTACT_MIN_LENGTH = 7;
	const CONTACT_MAX_LENGTH = 15;
	if (_.isEmpty(contact)) {
		return false;
	} else {
		if (!_.isString(contact)) {
			return false;
		} else {
			if (
				contact.length > CONTACT_MAX_LENGTH ||
				contact.length < CONTACT_MIN_LENGTH
			) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @description Validate user address
 */
const isValidUserAddress = (address) => {
	if (_.isEmpty(address)) {
		return false;
	} else {
		if (!_.isString(address)) {
			return false;
		}
	}
	return true;
}

/**
 * @description Validate user Occupation
 */
const isValidUserOccupation = (occupation) => {
	if (_.isEmpty(occupation)) {
		return false;
	} else {
		if (!_.isString(occupation)) {
			return false;
		}
	}
	return true;
}

/**
 * @description Validate department ID
 */
const isValidDepartmentId = (department_id) => {
	if (_.isEmpty(department_id)) {
		return false;
	} else {
		if (!_.isString(department_id)) {
			return false;
		}
	}
	return true;
}

/**
 * @description Validate department name
 */
const isValidDepartmentName = (department_name) => {
	if (_.isEmpty(department_name)) {
		return false;
	} else {
		if (!_.isString(department_name)) {
			return false;
		}
	}
	return true;
}

/**
 * @description Validate short name
 */
const isValidDesignationShortName = (short_name) => {
	const SHORT_NAME_MIN_LENGTH = 1;
	const SHORT_NAME_MAX_LENGTH = 45;
	if (_.isEmpty(short_name)) {
		return false;
	} else {
		if (!_.isString(short_name)) {
			return false;
		} else {
			if (short_name.length >= SHORT_NAME_MIN_LENGTH) {
				return true;
			}
			else if (short_name.length > SHORT_NAME_MAX_LENGTH) {
				return false;
			}
		}
	}
	return true;
}

/**
 * @description Validate user Transaction Id
 */
const isValidComment = (comment) => {
	const COMMENT_MIN_LENGTH = 0;
	const COMMENT_MAX_LENGTH = 500;
	if (_.isEmpty(comment)) {
		return false;
	} else {
		if (!_.isString(comment)) {
			return false;
		} else {
			if (comment.length >= COMMENT_MIN_LENGTH) {
				return true;
			}
			else if (comment.length > COMMENT_MAX_LENGTH) {
				return false;
			}
		}
	}
	return true;
}

module.exports = {
	isValidUsername,
	isValidUserFullName,
	isValidUserRole,
	isValidEmail,
	isValidUserAddress,
	isValidPassword,
	isValidUserContact,
	isValidUserOccupation,
	isValidDepartmentId,
	isValidDepartmentName,
	isValidDesignationShortName,
	isValidComment,
};
