// need validationResult that middleware float to req
const { validationResult } = require("express-validator");

module.exports = {
	handleErrors(templateFunc) {
		return (req, res, next) => {
			const errors = validationResult(req);
			//check error
			if (!errors.isEmpty()) {
				return res.send(templateFunc({ errors }));
			}
			next();
		};
	},
	requireAuth(req, res, next) {
		if (!req.session.userId) {
			return res.redirect("/signin");
		}
		next();
	},
};
