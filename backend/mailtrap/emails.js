import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: `Verify Your Email`,
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verification_code}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "eae6ce8b-c087-4217-8494-f6bc64c13632",
      template_variables: {
        company_info_name: "Personal Finance App",
        name: name,
      },
    });
    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (name, email, resetURL) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "6b820701-daef-42e8-8f81-8a5ab06398e8",
      template_variables: {
        resetURL: resetURL,
        name: name,
      },
    });
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "c044f0ad-974d-40f2-98b0-b1532ceb4e50",
    });

    console.log("Password reset email sent successfully, response");
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
