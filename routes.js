const path = require('path');

function setupRoutes(app, db) {
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'test.html'));
	});

	app.post('/game/test/pushbtn', (req, res) => {
		console.log(`Press Button ${req.body.times}!`);
		db.collection('test')
			.updateOne({}, { $inc: { button_pressed: req.body.times } })
			.then(doc => res.sendStatus(200))
			.catch(err =>
				res.status(500).json({
					error: 'Internal server error: could not push data to button.',
				})
			);
	});

	// app.post('/unity/hello', (req, res, next) => {
	// 	console.log('Hello JS!');
	// 	res.sendStatus(200);
	// });

	// app.post('/unity/hello/world', (req, res, next) => {
	// 	console.log(`Hello JS from ${req.body.u8message}`);
	// 	res.sendStatus(200);
	// });

	// app.get('/unity/pullbtn', (req, res, next) => {
	// 	db.collection('test')
	// 		.findOne({})
	// 		.then(doc => {
	// 			res.send(doc.button_pressed.toString());
	// 		})
	// 		.catch(err =>
	// 			res.status(500).json({
	// 				error: 'Internal server error: could not pull data from button.',
	// 			})
	// 		);
	// });

	// app.post('/unity/pushbtn', (req, res, next) => {
	// 	console.log(`Press Button ${req.body.times}!`);
	// 	db.collection('test')
	// 		.updateOne({}, { $inc: { button_pressed: req.body.times } })
	// 		.then(doc => res.sendStatus(200))
	// 		.catch(err =>
	// 			res.status(500).json({
	// 				error: 'Internal server error: could not push data to button.',
	// 			})
	// 		);
	// });
}

module.exports = setupRoutes;
