const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup (optional if you're using EJS for dashboard)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello from Render!');
});

// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Signup failed');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).send('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Login failed');
  }
});

// Dashboard route (optional)
app.get('/dashboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.render('dashboard', { users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
