const express = require('express')
const Article = require('../models/article')
const Author = require('../models/author')
const Review  = require ('../models/review')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; // Import ObjectId from mongoose

const router = new express.Router()

// name: CreateArticle
// description: creates an article 
// parameters: article details are sent in the body 
// return value: appropriate status and message 
const CreateArticle = async (req, res) => {
    const { author: authorEmail, dateOfPublication } = req.body;

    const existingId = await Article.findOne({ articleId: req.body.articleId });
    if (existingId) {
        return res.status(400).send({ error: 'ArticleId is already in use' });
    }

    try {
        // Manually validate the author's email
        const author = await Author.findOne({ email: req.body.email });
        if (!author) {
            return res.status(404).send({ error: 'Author does not exist' });
        }

        // Validate dateOfPublication format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateOfPublication)) {
            return res.status(400).send({ error: 'Date is not in correct format. It should be yyyy-mm-dd.' });
        }

        // Extract the date part without the time component
        const formattedDateString = new Date(dateOfPublication).toISOString().slice(0, 10);

        const article = new Article({
            ...req.body,
            author: author._id, // Assign the author's ObjectId
            dateOfPublication: formattedDateString // Use the formatted date string
        });

        await article.save();
        res.status(201).send(article);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Route handler to create an article
router.post('/articles', async (req, res) => {
    CreateArticle(req,res); 
}); 


// name: AddReviewToArticle
// description: adds a review to an article 
// parameters: review details are sent in the body, and the article id in the URL  
// return value: appropriate status and message 
const AddReviewToArticle = async (req, res) => {
    const { articleId } = req.params;
    const { heading, content, likes, dislikes } = req.body;

    try {
        console.log("articleId", articleId);
        const article = await Article.findOne({ articleId: articleId });

        if (!article) {
            return res.status(404).send({ error: 'Article does not exist' });
        }
 
        // Validate likes and dislikes
        if (likes < 0 || dislikes < 0) {
            const errorField = likes < 0 ? 'likes' : 'dislikes';
            return res.status(400).send({ error: `Number of ${errorField} cannot be negative` });
        }

        // Check if likes and dislikes are numbers
        if (typeof likes !== 'number' || typeof dislikes !== 'number') {
            const errorField = typeof likes !== 'number' ? 'likes' : 'dislikes';
            return res.status(400).send({ error: `${errorField} need to be a number` });
        }

        // Create a new instance of Review
        const newReview = new Review({
            heading,
            content,
            likes,
            dislikes
        });

        // Push the new review into the reviews array of the article
        article.reviews.push(newReview);
        // Don't save email field when adding review
        await article.save({ validateModifiedOnly: true });

        res.status(201).send({ message: 'Review added to article successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


// Route to add a review to an article
router.post('/articles/:articleId/reviews', AddReviewToArticle);


// name: getArticles
// description: returns a list of all of the articles 
// parameters:  N/A 
// return values: list of articles with appropriate status number. If none are present, a message stating that none are present along with appropriate status 
const getArticles = async (req, res) => {
    try {
        const articles = await Article.find();

        // Check if there are no articles
        if (articles.length === 0) {
            return res.status(404).send({ message: 'No articles found' });
        }

        // Loop through each article to populate the author field
        for (let article of articles) {

            console.log("aricle.email", article.email)
            // Find the author based on the email in the article
            const author = await Author.findOne({ email: article.email });

            console.log("found an author", author)
            if (author) {
                // If author found, populate the author field in the article
                console.log("author.name", author.name)
                article.email = author; 
            }
        }

        // Return articles with populated author field
        res.status(200).send(articles);
    } catch (error) {
        // Handle any errors
        res.status(500).send({ error: 'Internal server error' });
    }
};


// Route handler to get all articles
router.get('/articles', getArticles);

module.exports = router
