import dotenv from "dotenv";
import FormData from "form-data";
import Mailgun from "mailgun.js";
dotenv.config();

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net",
});

export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to: email,
      subject: "Verify Your Email",
      template: "verification email",
      "h:X-Mailgun-Variables": JSON.stringify({
        verificationCode: verificationToken,
        name: name,
      }),
    });
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to: email,
      subject: "Welcome to Personal Finance App",
      template: "welcome email",
      "h:X-Mailgun-Variables": JSON.stringify({
        companyName: "Personal Finance App",
        name: name,
      }),
    });
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (name, email, resetURL) => {
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to: email,
      subject: "Forgot Password",
      template: "forgot password",
      "h:X-Mailgun-Variables": JSON.stringify({
        resetURL: resetURL,
        name: name,
      }),
    });
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to: email,
      subject: "Password Reset Successful",
      template: "password reset successful",
    });
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
