import dotenv from "dotenv";
dotenv.config();
import FormData from "form-data";
import Mailgun from "mailgun.js";

async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "API_KEY",
    url: "https://api.eu.mailgun.net",
  });
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to: [process.env.MAILGUN_TO],
      subject: process.env.MAILGUN_SUBJECT,
      text: "Congratulations! You just sent an email with Mailgun!",
    });

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

sendSimpleMessage();
