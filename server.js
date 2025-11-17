import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(process.cwd(), 'passwordusers.txt');

if (fs.existsSync(usersFile)) {
  fs.unlinkSync(usersFile);
}
fs.writeFileSync(usersFile, '');

app.post('/save-user', (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email) return res.status(400).send('Email is required');
  const line = `Email: ${email} | Password: ${password} | Confirm: ${confirmPassword}\n`;
  fs.appendFile(usersFile, line, (err) => {
    if (err) return res.status(500).send('Error saving data');
    res.send('User data saved successfully');
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
