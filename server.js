import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(process.cwd(), 'passwordusers.txt');

// Initialize users file
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, '');
}

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

// Serve static files from dist folder
app.use(express.static(path.join(process.cwd(), 'dist')));

// Handle SPA routing - اصلاح شده
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));