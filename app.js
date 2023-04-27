if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
const setupRoutes = require('./routes.js');
const rateLimiter = require('express-rate-limit');
const { MongoClient } = require('mongodb');

const appPort = process.env.PORT || 3001;
const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;
const mguri = `mongodb+srv://${user}:${password}@${cluster}/${database}`;

async function main() {
	try {
		client = await MongoClient.connect(mguri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connection Established: User: ${user}, Cluster:${cluster}, Database:${database}`);
		const db = client.db();

		process.on('SIGINT', () => {
			client.close();
			console.log('MongoClient Connection Closed.');
			process.exit(0);
		});

		setupAppUsage();
		setupRoutes(app, db);
		startServer(appPort);
	} catch (err) {
		console.error(`MongoDB Connection Failed.`);
	}
}

function setupAppUsage() {
	//if (process.env.NODE_ENV === 'production') app.use(rateLimiter({ windowMs: 5 * 60 * 1000, max: 20 }));
	app.use(cors());

	//Serve .br files with Brotli compression
	app.get('*.br', function (req, res, next) {
		res.set('Content-Encoding', 'br');
		if (req.url.endsWith('.js.br')) res.setHeader('Content-Type', 'application/javascript');
		else if (req.url.endsWith('.wasm.br')) res.setHeader('Content-Type', 'application/wasm');
		else if (req.url.endsWith('.data.br')) res.setHeader('Content-Type', 'application/octet-stream');
		next();
	});

	//app.use(compressor); // this is slow for some reason. we'll look into it later.
	app.use('/static/', express.static(path.join(__dirname, 'public')));
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(express.text());
}

function startServer() {
	app.listen(appPort, err => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Express server listening on port ${appPort}`);
	});
}

main();
