const path = require('path');

function setupRoutes(app, db) {
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});

	async function getLeaderBoard(res, sortfunc) {
		try {
			const leaderBoard = await db.collection('Ranking').find({}).sort(sortfunc).limit(20).toArray();
			res.json({ ranks: leaderBoard });
		} catch (err) {
			console.log(err);
		}
	}
	app.get(process.env.EL_WWW_GET_RANK_SCORE, (req, res) => {
		getLeaderBoard(res, { score: -1, time: 1 });
	});

	app.get(process.env.EL_WWW_GET_RANK_TIME, (req, res) => {
		getLeaderBoard(res, { time: 1, score: -1 });
	});

	app.post(process.env.EL_WWW_POST_RANK, async (req, res) => {
		try {
			console.log(req.body);
			const col = db.collection('Ranking');
			await col.insertOne(req.body);
		} catch (err) {
			console.log(`Failed to post rank: ${err}`);
		}
		getLeaderBoard(res, { score: -1, time: 1 });
	});

	app.all('*', (req, res) => {
		console.log(`Unhandled request: ${req.method} ${req.url}`);
		console.log('Headers:', req.headers);
		console.log('Body:', req.body);
		res.status(404).send('Not found');
	});
}

module.exports = setupRoutes;
