const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/wikiDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const articleSchema = {
	title: String,
	content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));

app.get("/articles", (req, res) => {
	Article.find({}, (err, allArticles) => {
		if (err) {
			res.send(err);
		} else {
			res.send(allArticles);
		}
	});
});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
