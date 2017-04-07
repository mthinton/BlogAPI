const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Traveling to Europe', 'Those were the best years of my life. Not a care in the world', 'Matthew Hinton');
BlogPosts.create('Moving to Philly', 'I knew I wanted to be in a big city. Philadelphia simply seemed it', 'Matthew Hinton', '11/1/09');
BlogPosts.create('Graduating from Thinkful', 'Sometimes you hit a wall in your career. That is where Thinkful came in', 'Author unknown');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['author', 'title', 'content', 'publishDate'];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	res.status(204).end();
})

router.put('/:id', jsonParser, (req, res) => {
	const updatedPost = BlogPosts.create({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(200).json(updatedPost);
})
module.exports = router;