const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const supabase = require('../dbConnect');
require('dotenv').config();

module.exports = {
	// POST: /api/auth/sign-in
	sign_in: [
		body('username')
			.trim()
			.isLength({ min: 4 })
			.withMessage('Username is too short')
			.custom(async (username) => {
				try {
					const { data } = await supabase
						.from('user')
						.select('username')
						.eq('username', username);

					if (data.length !== 0) {
						throw new Error('Username already exist');
					}
				} catch (error) {
					throw new Error(error);
				}
			}),

		body('email')
			.trim()
			.isEmail()
			.withMessage('Invalid Email')
			.custom(async (email) => {
				try {
					const { data } = await supabase
						.from('user')
						.select('email')
						.eq('email', email);
					if (data.length !== 0) {
						throw new Error('Username already exist');
					}
				} catch (error) {
					throw new Error(error);
				}
			}),

		body('password')
			.trim()
			.isLength({ min: 4 })
			.withMessage('Password atleast 4 words long'),

		asyncHandler(async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(401).json(errors.array());
			}

			const response = await supabase.from('user').insert({
				username: req.body.username,
				email: req.body.email,
				password: await bcrypt.hash(req.body.password, 12),
			});

			return res.status(200).json(response);
		}),
	],

	// POST: /api/auth/log-in
	log_in: asyncHandler(async (req, res) => {
		// Find user and compare username and password
		const { data, error } = await supabase
			.from('user')
			.select('username, password')
			.eq('username', req.body.username);

		if (error) {
			return res.status(401).json(error);
		}

		if (data.length === 0) {
			return res.status(401).json({ msg: 'User does not exist' });
		}

		if (await bcrypt.compare(req.body.password, data[0].password)) {
			const user = {
				username: req.body.username,
			};

			jwt.sign({ user }, process.env.JWT_SECRET_KEY, (err, token) => {
				if (err) return res.status(401).json(err);
				return res.json({ token, msg: 'Login success' });
			});
		}
	}),
};
