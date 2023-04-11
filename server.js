const ejs = require('ejs');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const app = express();
const cors = require('cors');
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Configure SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.post('/send-email', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, description } = req.body;

  const msg = {
    to: 'e1vjs@icloud.com', // your email address to receive the message
    from: {
        email:'beast910@icloud.com',
        name: "Heavy Metal Detailing" },
        // the sender's email address
    subject: 'Clients Car Info',
    html: `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Description:</strong> ${description}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    const filePath = path.join(__dirname, 'public', 'thankyou.html');
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
