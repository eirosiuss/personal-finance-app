import dotenv from "dotenv";
import FormData from "form-data";
import Mailgun from "mailgun.js";

dotenv.config();

async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);

  // Pasirenkame endpoint pagal regioną
  const clientOptions = {
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net"
  };

  const mg = mailgun.client(clientOptions);

      const domains = await mg.domains.list();
    console.log("✅ API Key veikia! Prieinami domenai:");
    console.log(domains);

  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: "Mailgun Sandbox <postmaster@sandbox6f921155679d4e07a0c2eff3b0eb9b6a.mailgun.org>",
      to: process.env.MAILGUN_TO,
      subject: "Hello Kestutis Eirosius",
      text: "Congratulations Kestutis Eirosius, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

sendSimpleMessage();
