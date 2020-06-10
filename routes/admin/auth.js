const express = require("express");

// link to midlleware.js in route/admin/middlewares.js
const { handleErrors } = require("./middlewares");

const usersRepo = require("../../repositories/user");
//create sub router to link to index.js
const router = express.Router();

//connect template signUp
const signupTemplate = require("../../views/admin/auth/signup");

//connect template signin
const signinTemplate = require("../../views/admin/auth/signin");

//destructuring validator
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPasswordForUser,
} = require("./validator");

router.get("/signup", (req, res) => {
	// pass signupTemplate
	res.send(signupTemplate({ req }));
});

router.post(
	"/signup",
	[
		//validate Email
		requireEmail,
		//validate password
		requirePassword,
		//ConfirmPass
		requirePasswordConfirmation,
	],
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;

		const getOne = usersRepo.randomId();

		//after check, add new use in db
		const user = await usersRepo.create({
			email: email,
			password: password,
		});

		//store id for user
		req.session.userId = user.id;

		res.redirect("/admin/products");
	}
);

// sign out
router.get("/signout", (req, res) => {
	req.session = null;
	res.send("you are log out");
});

//Sign in
router.get("/signin", (req, res) => {
	res.send(signinTemplate({}));
});

//handle post sign in
router.post(
	"/signin",
	[requireEmailExists, requireValidPasswordForUser],
	//  handler for requireEmail, requirePassword
	handleErrors(signinTemplate),
	async (req, res) => {
		//grab body

		const { emailSignin, passwordSignin } = req.body;

		//assign id bu user.id

		req.session.userId = user.id;

		res.redirect("/admin/products");
	}
);

module.exports = router;
