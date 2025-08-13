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
