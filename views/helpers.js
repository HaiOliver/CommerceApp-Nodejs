module.exports = {
	getError(errors, props) {
		console.log(
			"error object will be================================: ",
			errors
		);
		console.log(
			"props test:+++++++++++++++++++++++++++++++++++++++++++++++ ",
			props
		);
		try {
			return errors.mapped()[props].msg;
		} catch (e) {
			return " ";
		}
	},
};
