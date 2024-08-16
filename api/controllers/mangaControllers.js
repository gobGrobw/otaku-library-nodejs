const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const supabase = require('../dbConnect');
require('dotenv').config();

module.exports = {
	// GET: /api/mangaList/all
	get_all_manga_from_list: asyncHandler(async (req, res) => {
		const user = jwt.verify(
			req.token,
			process.env.JWT_SECRET_KEY,
			(err, data) => {
				return data.user;
			}
		);

		const { data, error } = await supabase
			.from('user')
			.select('username, manga_list')
			.eq('username', user.username);

		if (error) {
			return res.status(401).json(error);
		}

		// Sends payload, total manga, and total manga of each status
		const mangaData = {
			payload: data[0].manga_list,
			count: data[0].manga_list.length,
			reading: data[0].manga_list.filter(
				(x) => x.readStatus.toLowerCase() == 'reading'
			).length,
			completed: data[0].manga_list.filter(
				(x) => x.readStatus.toLowerCase() == 'completed'
			).length,
			planned: data[0].manga_list.filter(
				(x) => x.readStatus.toLowerCase() == 'planned'
			).length,
			dropped: data[0].manga_list.filter(
				(x) => x.readStatus.toLowerCase() == 'dropped'
			).length,
		};

		return res.json(mangaData);
	}),

	// GET: /api/mangaList/{id}
	get_manga_from_list: asyncHandler(async (req, res) => {
		const user = jwt.verify(
			req.token,
			process.env.JWT_SECRET_KEY,
			(err, data) => {
				return data.user;
			}
		);

		const { data, error } = await supabase
			.from('user')
			.select('username, manga_list')
			.eq('username', user.username);

		if (error) {
			return res.status(401).json(error);
		}

		const manga = data[0].manga_list.filter((x) => x.id == req.params.id);
		return res.json(manga);
	}),

	// POST: /api/mangaList/add
	add_manga_to_list: asyncHandler(async (req, res) => {
		const user = jwt.verify(
			req.token,
			process.env.JWT_SECRET_KEY,
			(err, data) => {
				return data.user;
			}
		);

		const { data, error } = await supabase
			.from('user')
			.select()
			.eq('username', user.username);

		if (error) {
			return res.status(401).json(error);
		}

		const manga = {
			id: req.body.id,
			title: req.body.title,
			readStatus: req.body.readStatus,
			imgUrl: req.body.imgUrl,
		};

		const appendedData = [...data[0].manga_list, manga];
		data[0].manga_list = appendedData;
		await supabase.from('user').update(data).eq('username', user.username);
		return res.json({ msg: 'Post success' });
	}),

	// PATCH: /api/mangaList/update
	update_manga_in_list: asyncHandler(async (req, res) => {
		const user = jwt.verify(
			req.token,
			process.env.JWT_SECRET_KEY,
			(err, data) => {
				return data.user;
			}
		);

		const { data, error } = await supabase
			.from('user')
			.select()
			.eq('username', user.username);

		if (error) {
			return res.status(401).json(error);
		}

		const updatedData = data[0].manga_list.map((x) => {
			if (x.id == req.body.id) {
				x.readStatus = req.body.readStatus;
			}

			return x;
		});

		data[0].manga_list = updatedData;
		await supabase.from('user').update(data).eq('username', user.username);
		return res.json({ msg: 'Patch success' });
	}),

	// DELETE: /api/mangaList/delete
	delete_manga_from_list: asyncHandler(async (req, res) => {
		const user = jwt.verify(
			req.token,
			process.env.JWT_SECRET_KEY,
			(err, data) => {
				return data.user;
			}
		);

		const { data, error } = await supabase
			.from('user')
			.select()
			.eq('username', user.username);

		if (error) {
			return res.status(401).json(error);
		}

		const updatedData = data[0].manga_list.filter((x) => x.id != req.params.id);
		data[0].manga_list = updatedData;

		console.log(updatedData);
		await supabase.from('user').update(data).eq('username', user.username);
		return res.json({ msg: 'Delete success' });
	}),
};
