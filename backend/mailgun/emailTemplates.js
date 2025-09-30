export const VERIFICATION_EMAIL_TEMPLATE = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Verify Your Email</title>
  </head>
  <body style="margin:0; padding:0; background:#f9f9f9; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; padding:20px;">
            <tr>
              <td style="padding-top:10px; font-size:22px; font-weight:bold;">Hello, {name} thank you for signing up!</td>
            </tr>
            <tr>
              <td style="padding-top:15px; font-size:12px; color:#777;">
                Your verification code is <strong>{verification_code}</strong>.
              </td>
            </tr>
            <tr>
              <td style="padding-top:15px; font-size:12px; color:#777;">
                Enter this code on the verification page to complete your registration.
              </td>
            </tr>
            <tr>
              <td style="padding-top:15px; font-size:12px; color:#777;">
                This code is valid for 15 minutes. If you did not request this, please ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Password Reset Request</title>
  </head>
  <body style="margin:0; padding:0; background:#f9f9f9; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; padding:20px;">
            <tr>
              <td style="padding-top:10px; font-size:22px; font-weight:bold;">Forgot Password</td>
            </tr>
            <tr>
              <td style="padding-top:15px; font-size:14px; color:#333;">
                Enter your email address and we'll send you a link to reset your password.
              </td>
            </tr>
            <tr>
              <td style="padding-top:10px; font-size:14px; color:#555;">
                This link expires in {{link_expiry_minutes}} minutes for your security.
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;" align="center">
                <a href="{{reset_link}}" style="background:#4f46e5; color:#ffffff; padding:10px 20px; text-decoration:none; border-radius:4px;">
                  Reset Password
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Password Reset Successful</title>
  </head>
  <body style="margin:0; padding:0; background:#f9f9f9; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; padding:20px;">
            <tr>
              <td style="font-size:18px; font-weight:bold;">{{app_name}}</td>
            </tr>
            <tr>
              <td style="padding-top:10px; font-size:22px; font-weight:bold;">Hi {{user_name}},</td>
            </tr>
            <tr>
              <td style="padding-top:15px; font-size:14px; color:#333;">
                Your {{app_name}} password was successfully changed on {{changed_at}}.
              </td>
            </tr>
            <tr>
              <td style="padding-top:10px; font-size:14px; color:#555;">
                If this wasn’t you, please reset your password immediately and review recent activity.
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;" align="center">
                <a href="{{secure_account_link}}" style="background:#ef4444; color:#ffffff; padding:10px 20px; text-decoration:none; border-radius:4px;">
                  Secure My Account
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:15px; font-size:12px; color:#777;">
                Or go to: <a href="{{secure_account_link}}" style="color:#2563eb;">{{secure_account_link}}</a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px; font-size:12px; color:#999;">
                Questions? Contact <a href="mailto:{{support_email}}">{{support_email}}</a>.<br>
                © {{current_year}} {{app_name}}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
