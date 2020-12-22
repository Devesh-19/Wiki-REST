const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/wikiDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const articleSchema = {
	title: String,
	content: String,
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////// Requests Targetting all Articles /////////////////////////////

app.route("/articles")
	.get((req, res) => {
		Article.find({}, (err, foundArticles) => {
			if (err) {
				res.send(err);
			} else {
				res.send(foundArticles);
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

///////////////////////////// Requests Targetting a Specific Article /////////////////////////////

app.route("/articles/:articleTitle")

	.get((req, res) => {
		Article.findOne(
			{ title: req.params.articleTitle },
			(err, foundArticle) => {
				if (!err) {
					res.send(foundArticle);
				} else {
					res.send("No article matching that title was found.");
				}
			}
		);
	})

	.put((req, res) => {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			(err, updatedArticle) => {
				if (!err) {
					res.send(updatedArticle);
				} else {
					res.send(err);
				}
			}
		);
	})

	.patch((req, res) => {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ $set: req.body },
			(err, updatedArticle) => {
				if (!err) {
					res.send(updatedArticle);
				} else {
					res.send(err);
				}
			}
		);
	});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
