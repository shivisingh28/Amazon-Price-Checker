require("dotenv").config();
const sgmail = require("@sendgrid/mail");
sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const nightmare = require("nightmare")();

const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];
checkPrice();
async function checkPrice() {
	try {
		const priceString = await nightmare
			.goto(url)
			.wait("#priceblock_ourprice")
			.evaluate(() => document.getElementById("priceblock_ourprice").innerText)
			.end();

		const priceNumber = parseFloat(priceString.replace("$", ""));

		if (priceNumber < minPrice) {
			await sendEmail(
				"Price is Low",
				`The price on ${url}has dropped below ${minPrice}`
			);
		}
	} catch (e) {
	await	sendEmail("Amazon Price Checker Error", e.message);
		throw e;
	}
}

function sendEmail(subject, body) {
	const email = {
		to: "corkajalte@biyac.com",
		from: "amazon-price-checker@example.com",
		subject: subject,
		text: body,
		html: body,
	};
	return sgmail.sendEmail(email);
}
