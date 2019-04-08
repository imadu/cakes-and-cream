const mailer = require('nodemailer');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const hbs = require('nodemailer-express-handlebars');
const config = require('../config')();


const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: config.redirectUri,
});

oauth2Client.setCredentials({
  refresh_token: config.refresh_token,
});
const options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: './public/views/layouts',
    defaultLayout: 'template',
    partialsDir: './public/views/partials/',
  },
  viewPath: 'views/email/',
  extName: '.hbs',
};
const accessToken = oauth2Client.refreshAccessToken().then(res => res.credentials.access_token);

// create reusable transporter object using the default SMTP transport
const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'ikechukwu.madu1@gmail.com',
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refresh_token,
    accessToken: config.accessToken,
  },
});


const mailFunction = {
  notification(req) {
    const notificationOutput = `<p> Dear ${req.email} </p>
        <p> Thank you for registering with  CSLT to create your wills and trust !</p>
        <p> please take your time to fill the other sections of the form </p>
        <p> For further enquires please contact us enquires@ cslt.com  </p>
        `;

    // setup email data with unicode symbols
    const mailOptions = {
      from: '" CSLT  " <ikechukwu.madu1@gmail.com>', // sender address
      to: `${req.email}`, // list of receivers
      subject: 'Registrtion Successful ✔', // Subject line
      html: notificationOutput, // html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      return console.log(info.messageId);
    });
  },

  finished(req) {
    const finishedOutput = `<p> Dear ${req.email} </p>
        <p> Your informations have been saved successfully  !</p>
        <p> one of our agents will contact you shortly </p>
        <p> For further enquires please contact us enquires@ cslt.com  </p>
        `;
    const mailOptions = {
      from: '" CSLT  " <ikechukwu.madu1@gmail.com>', // sender address
      to: `${req.email}`, // list of receivers
      subject: ' Form Details Complete ✔', // Subject line
      html: finishedOutput, // html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      return console.log(info.messageId);
    });
  },

  adminRegistrationNotifier(req) {
    const notifierOutput = `<p> A user with email : ${req.email} just registed on the form application</p>
    <p> please check the admin panel to see user's details </p>
    `;
    const mailOptions = {
      from: '"Notifications  " <ikechukwu.madu1@gmail.com>', // sender address
      to: 'ife@rightclick-ng.com', // list of receivers
      subject: ' User registered ✔', // Subject line
      html: notifierOutput, // html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      return console.log(info.messageId);
    });
  },


  forgotPassword(req) {
    const mailBody = {
      email: req.email,
      id: req._id,
    };
    const token = jwt.sign({ user: mailBody }, config.secret, {
      expiresIn: config.mailExpiresin,
    });
    console.log('token is ', token);
    console.log('receipent is ', req.email);
    const forgotOutput = `<p> Dear ${req.email}, a password reset was requested on you  CSLTt wills account </p>
    <p> if you authorized this password reset, please use this link below<p>
    <a href="http://csltform.rc-demoserver.com/reset-password/?token=${token}"> RESET PASSWORD </a>.
    <p> if you did not authorize this password reset, please contact us at enquires@ CSLT.com</p>
    <p> this link expires in One hour after which you would not be able to use it again</p>
    <p> thank you</p>`;

    const mailOptions = {
      from: '"Notifications  " <ikechukwu.madu1@gmail.com>',
      to: `${req.email}`,
      subject: 'Forgotten Password',
      html: forgotOutput,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      return console.log(info.messageId);
    });
  },
};


module.exports = mailFunction;
