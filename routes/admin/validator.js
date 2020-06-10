const { check } = require("express-validator");
const usersRepo = require("../../repositories/user");

module.exports = {
	requireTitle: check("title")
		.trim()
		.isLength({ min: 5, max: 40 })
		.withMessage("Must be between 5 to 40 character"),
	requirePrice: check("price")
		.trim()
		.toFloat()
		.isFloat({ min: 1 })
		.withMessage(
			"Must be a number greater than 1, Oliver, Line 14 validator.js"
		),
	requireEmail: check("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Must be a valid Email, Oliver")
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({
				email,
			});

			if (existingUser) {
				throw new Error(
					"Email in use, .custom() in check emaill trigger"
				);
			}
		}),
	//validate password
	requirePassword: check("password")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("Must be length between 20 and 4"),
	requirePasswordConfirmation: check("passwordConfirmation")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("Must be between 4 and 20")
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error(
					"Password is not match passwordConfirmation"
				);
			}
		}),
	requireEmailExists: check("emailSignin")
		.isEmail()
		.trim()
		.normalizeEmail()
		.withMessage("Must provide a valid Email, Oliver")
		.custom(async (emailSignin) => {
			//get user by GetByOne()
			const user = await usersRepo.getOneBy({
				email: emailSignin,
			});

			//if check email && password

			if (!user) {
				throw new Error("Email not found in DB");
			}
		}),
	requireValidPasswordForUser: check("passwordSignin")
		.trim()
		.custom(async (passwordSignin, { req }) => {
			//grab user
			const user = await usersRepo.getOneBy({
				email: req.body.email,
			});

			if (!user) {
				throw new Error(
					"Invalid Password Oliver, requireValidPasswordFrorUser"
				);
			}
			// grab comparePassword in user.js
			const comparePassword = await usersRepo.comparePassword(
				// password in DB
				user.password,
				// password from user input
				passwordSignin
			);

			if (!comparePassword) {
				throw new Error(
					"password not match, check passwordSignIn"
				);
			}
		}),
};
