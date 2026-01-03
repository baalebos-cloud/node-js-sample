const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// ✅ Add your routes here
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.send('🚀 Server is alive');
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Listening on port ${PORT}`);
});
