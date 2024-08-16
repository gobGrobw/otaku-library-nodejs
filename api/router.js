const router = require('express').Router();
const authControllers = require('./controllers/authControllers');
const animeControllers = require('./controllers/animeControllers');
const mangaControllers = require('./controllers/mangaControllers');
const { verifyJwt } = require('./jwtService');

/* 
	Authentication
*/
// Sign in
router.post('/auth/sign-in', authControllers.sign_in);

// Log in
router.post('/auth/log-in', authControllers.log_in);

/* 
	Anime API Routes
*/
// Require authorization

// GET: /api/animeList/all
router.get('/animeList/all', verifyJwt, animeControllers.get_all_anime_from_list);

// GET: /api/animeList/{id}
router.get('/animeList/:id', verifyJwt, animeControllers.get_anime_from_list);

// POST: /api/animeList/add
router.post('/animeList/add', verifyJwt, animeControllers.add_anime_to_list);

// PATCH: /api/animeList/update
router.patch('/animeList/update', verifyJwt, animeControllers.update_anime_in_list);

// DELETE: /api/animeList/delete
router.delete(
	'/animeList/delete/:id',
	verifyJwt,
	animeControllers.delete_anime_from_list
);

/* 
	Manga API Routes
*/
// Require authorization

// GET: /api/mangaList/all
router.get('/mangaList/all', verifyJwt, mangaControllers.get_all_manga_from_list);

// GET: /api/mangaList/{id}
router.get('/mangaList/:id', verifyJwt, mangaControllers.get_manga_from_list);

// POST: /api/mangaList/add
router.post('/mangaList/add', verifyJwt, mangaControllers.add_manga_to_list);

// PATCH: /api/mangaList/update
router.patch('/mangaList/update', verifyJwt, mangaControllers.update_manga_in_list);

// DELETE: /api/mangaList/delete
router.delete(
	'/mangaList/delete/:id',
	verifyJwt,
	mangaControllers.delete_manga_from_list
);

module.exports = router;
