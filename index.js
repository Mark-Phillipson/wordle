const PORT = 8000;
const axios = require("axios").default;
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());

app.get("/word", (req, res) => {

	const options = {
		method: 'GET',
		url: 'https://wordsapiv1.p.rapidapi.com/words/',
		params: {
			random: 'true',
			hasDetails: 'definitions',
			letters: '5'
		},
		headers: {
			'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
			'x-rapidapi-key': process.env.RAPID_API_KEY
		}
	};

	axios.request(options).then((response) => {
		console.log(response.data.word);
		res.json(response.data.word)
	}).catch((error) => {
		console.error(error);
	});
});

app.get("/check", (req, res) => {
	const word = req.query.word;
	const options = {
		method: 'GET',
		url: 'https://wordsapiv1.p.rapidapi.com/words/'+ word,
		params: {
		},
		headers: {
			'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
			'x-rapidapi-key': process.env.RAPID_API_KEY
		}
	};

	axios.request(options).then((response) => {
		if (response.data.word.toUpperCase()==word.toUpperCase()) {
			res.json(true);
		}
		else 
		{
			// if Plural will return the singular version so still a valid word
			if (word[4].toUpperCase()=="S" && response.data.word.toUpperCase()==word.toUpperCase().substring(0,4)) {
				res.json(true);
				return;
			}
			res.json(false);
		}
	}).catch((error) => {
		res.json(false);
	});
});
app.listen(PORT, () => console.log("Server running on port " + PORT));

