import express from "express";
import bodyParser from "body-parser";
//import cors from 'cors'
import easyvk from "easyvk";
import database from "../database";
import { PORT, CONFIRMATION, TOKEN, ACCESS_TOKEN } from "../config";

const app = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(cors(corsOptions))

database()
  .then(info => {
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    app.listen(PORT, () => {
      console.log(`Listenning port: ${PORT}`);
    });
  })
  .catch(() => {
    console.error("error");
    process.exit(1);
  });

// app.post("/", (req, res) => {
//   const { body } = req;
//   if (body.type === "confirmation") res.end(CONFIRMATION);
// });

const { VK } = require('vk-io');

const vk = new VK({
	token: TOKEN
});

vk.updates.hear('/start', async (context) => {
	await context.send(`
		My commands list
		/cat - Cat photo
		/purr - Cat purring
		/time - The current date
		/reverse - Reverse text
	`);
});

vk.updates.hear('/cat', async (context) => {
	await Promise.all([
		context.send('Wait for the uploads awesome 😻'),

		context.sendPhoto('https://loremflickr.com/400/300/')
	]);
});

vk.updates.hear(['/time', '/date'], async (context) => {
	await context.send(String(new Date()));
});

vk.updates.hear(/^\/reverse (.+)/i, async (context) => {
	await context.send(
		context.$match[1].split('').reverse().join('')
	);
});

const catsPurring = [
	'http://ronsen.org/purrfectsounds/purrs/trip.mp3',
	'http://ronsen.org/purrfectsounds/purrs/maja.mp3',
	'http://ronsen.org/purrfectsounds/purrs/chicken.mp3'
];

vk.updates.hear('/purr', async (context) => {
	const link = catsPurring[Math.floor(Math.random() * catsPurring.length)];

	await Promise.all([
		context.send('Wait for the uploads purring 😻'),

		context.sendAudioMessage(link)
	]);
});

vk.updates.start().catch(console.error);