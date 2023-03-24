const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static('public'));

// Configure SendGrid with your API key
sgMail.setApiKey('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');

app.post('/send-email', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, description } = req.body;

  const msg = {
    to: 'e1vjs@icloud.com', // your email address to receive the message
    from: 'beast910@icloud.com', // the sender's email address
    subject: 'New quote request',
    html: `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Description:</strong> ${description}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Email sent');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
