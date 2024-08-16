const express = require('express');
const apiRouter = require('./router');
const cors = require('cors');
const allowCors = require('./allowCors');
require('./dbConnect');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: 'https://otaku-library.vercel.app/' }));
app.use(allowCors);

app.get('/', async (req, res) => {
	return res.redirect('/api');
});

app.use('/api', apiRouter);

app.listen(5000, () => {
	return console.log('Server is now online');
});
