const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const supabase = require('../dbConnect');
require('dotenv').config();

module.exports = {
	// GET: /api/animeList/all
	get_all_anime_from_list: asyncHandler(async (req, res) => {
		const user = jwt.verify(
			req.token,
			process.env.JWT_SECRET_KEY,
			(err, data) => {
				return data.user;
			}
		);

		const { data, error } = await supabase
			.from('user')
			.select('username, anime_list')
			.eq('username', user.username);

		if (error) {
			return res.status(401).json(error);
		}

		// Sends payload, total anime, and total anime of each status
		const animeData = {
			payload: data[0].anime_list,
			count: data[0].anime_list.length,
			watching: data[0].anime_list.filter(
				(x) => x.watchStatus.toLowerCase() == 'watching'
			).length,
			completed: data[0].anime_list.filter(
				(x) => x.watchStatus.toLowerCase() == 'completed'
			).length,
			planned: data[0].anime_list.filter(
				(x) => x.watchStatus.toLowerCase() == 'planned'
			).length,
			dropped: data[0].anime_list.filter(
				(x) => x.watchStatus.toLowerCase() == 'dropped'
			).length,
		};

		return res.json(animeData);
	}),

	// GET: /api/animeList/{id}
	get_anime_from_list: asyncHandler(async (req, res) => {
		const user = jwt.verify(
			req.token,
			process.env.JWT_SECRET_KEY,
			(err, data) => {
				return data.user;
			}
		);

		const { data, error } = await supabase
			.from('user')
			.select('username, anime_list')
			.eq('username', user.username);

		if (error) {
			return res.status(401).json(error);
		}

		const anime = data[0].anime_list.filter((x) => x.id == req.params.id);
		return res.json(anime);
	}),

	// POST: /api/animeList/add
	add_anime_to_list: asyncHandler(async (req, res) => {
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

		const anime = {
			id: req.body.id,
			title: req.body.title,
			watchStatus: req.body.watchStatus,
			imgUrl: req.body.imgUrl,
		};

		const appendedData = [...data[0].anime_list, anime];
		data[0].anime_list = appendedData;
		await supabase.from('user').update(data).eq('username', user.username);
		return res.json({ msg: 'Post success' });
	}),

	// PATCH: /api/animeList/update
	update_anime_in_list: asyncHandler(async (req, res) => {
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

		const updatedData = data[0].anime_list.map((x) => {
			if (x.id == req.body.id) {
				x.watchStatus = req.body.watchStatus;
			}

			return x;
		});

		data[0].anime_list = updatedData;
		await supabase.from('user').update(data).eq('username', user.username);
		return res.json({ msg: 'Patch success' });
	}),

	// DELETE: /api/animeList/delete
	delete_anime_from_list: asyncHandler(async (req, res) => {
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

		const updatedData = data[0].anime_list.filter((x) => x.id != req.params.id);
		data[0].anime_list = updatedData;

		console.log(updatedData);
		await supabase.from('user').update(data).eq('username', user.username);
		return res.json({ msg: 'Delete success' });
	}),
};
