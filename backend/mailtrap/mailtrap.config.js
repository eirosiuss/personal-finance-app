// import dotenv from "dotenv";
import { MailtrapClient } from "mailtrap";
// dotenv.config({ path: "../config.env" });

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Personal Finance App",
};