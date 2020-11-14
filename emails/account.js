const sgMail = require('@sendgrid/mail')
const { SENGRID_API_KEY, EMAIL } = require('../config/keys')

sgMail.setApiKey(SENGRID_API_KEY)

const sendWelcomeEmail = (name, email) => {
   sgMail.send({
      to: email,
      from: 'writivelabs123@outlook.com',
      subject: 'Welcome to Writive Labs!',
      text: `Happy to see you, ${name}`,
   })
}

const sendResetPasswordMail = (token, email) => {
   sgMail.send({
      to: email,
      from: 'writivelabs123@outlook.com',
      subject: 'Reset password',
      html: `<h4><a href="${EMAIL}/forgotpassword/${token}">Click here to reset password.</a> This link is valid for only 1 hour</h4>`,
   })
}

const sendVerifyEmail = (token, email) => {
   sgMail.send({
      to: email,
      from: 'writivelabs123@outlook.com',
      subject: 'Verify email',
      html: `<h4><a href="${EMAIL}/verifyemail/${token}">Click here to verify email.</a> This link is valid for only 1 hour</h4>`,
   })
}

const sendCancellationEmail = (name, email) => {
   sgMail.send({
      to: email,
      from: 'writivelabs123@outlook.com',
      subject: 'Sorry to see you go!',
      text: `Hope to see you again, ${name}`,
   })
}

module.exports = {
   sendWelcomeEmail,
   sendResetPasswordMail,
   sendCancellationEmail,
   sendVerifyEmail,
}
