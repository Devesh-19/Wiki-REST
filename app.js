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

app.route("/articles")
	.get((req, res) => {
		Article.find({}, (err, allArticles) => {
			if (err) {
				res.send(err);
			} else {
				res.send(allArticles);
			}
		});
	})
	.post((req, res) => {
		const title = req.body.title;
		const content = req.body.content;
		const newArticle = new Article({ title, content });
		newArticle.save((err) => {
			if (!err) {
				res.send("Successfully created an article on the wiki!");
			} else {
				res.send(err);
			}
		});
	})
	.delete((req, res) => {
		Article.deleteMany((err) => {
			if (!err) {
				res.send("All the articles have been removed!");
			} else {
				res.send(err);
			}
		});
	});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
