const verifyJwt = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	if (!bearerHeader) return res.status(403).end('Not authorized');

	const bearer = bearerHeader.split(' ')[1];
	req.token = bearer;
	next();
};

module.exports = { verifyJwt };
