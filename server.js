import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(process.cwd(), 'passwordusers.txt');

if (fs.existsSync(usersFile)) {
  fs.unlinkSync(usersFile);
}
fs.writeFileSync(usersFile, '');

app.post('/save-user', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) return res.status(400).send('Email and password are required');
    if (password !== confirmPassword) return res.status(400).send('Passwords do not match');

    const hashedPassword = await bcrypt.hash(password, 10);
    const line = `Email: ${email} | Password: ${hashedPassword} | Confirm: ${confirmPassword}\n`;

    await fs.promises.appendFile(usersFile, line);
    res.send('User data saved successfully');
  } catch (err) {
    res.status(500).send('Error saving data');
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
