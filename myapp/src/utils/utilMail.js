const nodemailer = require("nodemailer");

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_SECURE || true,
  auth: {
    user: process.env.EMAIL_USER || "thanhvu6a1@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "vlyzugdjudnsuaaw",
  },
  tls: {
    rejectUnauthorized: false,
  },
};

exports.sendMail = async (mailSendTo, message) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const content = `
      <div style="padding: 10px; background-color: #003375">
          <div style="padding: 10px; background-color: white;">
              <h4 style="color: #0085ff">Hello</h4>
              <span style="color: black">${message.text}</span>
          </div>
      </div>
    `;
    console.log("?: ------------" + message);

    const mainOptions = {
      from: emailConfig.auth.user,
      to: mailSendTo,
      subject: message.subject,
      text: "Your text is here",
      html: content,
    };
    const info = await transporter.sendMail(mainOptions);
  } catch (error) {
    console.log(error);
  }
};
