const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/save-user', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');

  fs.appendFile('users.txt', email + '\n', (err) => {
    if (err) return res.status(500).send('Error saving email');
    res.send('Email saved successfully');
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
