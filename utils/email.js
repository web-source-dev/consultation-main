const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SENDINBLUE_EMAIL,
      pass: process.env.SENDINBLUE_API_KEY,
    },
  });

  const mailOptions = {
    from: process.env.SENDINBLUE_EMAIL,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
