const mongoose = require("mongoose");
require("dotenv").config();

exports.connecDB = () => {
	mongoose
		.connect(process.env.MONGODB_URI)
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.log("Error connecting to MongoDB");
			console.log(err);
			process.exit(1);
		});
};
