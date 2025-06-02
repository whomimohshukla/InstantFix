const express = require("express");
const app = express();
const database = require("./config/database");
database.connecDB();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
