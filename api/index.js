const express = require('express');
const apiRouter = require('./router');
const cors = require('cors');
require('./dbConnect');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', async (req, res) => {
	return res.redirect('/api');
});

app.use('/api', apiRouter);

app.all('/api/*/*', (req, res) => {
	return res.status(404).json({ msg: 'Route not found' });
});

app.listen(5000, () => {
	return console.log('Server is now online');
});
