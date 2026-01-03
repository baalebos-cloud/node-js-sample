const pool = require('../db');
const bcrypt = require('bcrypt');

(async () => {
  try {
    console.log('🌱 Seeding started...');

// Hash passwords
    const password1 = await bcrypt.hash('securepassword1', 10);
    const password2 = await bcrypt.hash('securepassword2', 10);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
  INSERT INTO users (name, email, password)
  VALUES
    ('Oluwadare Jayeola', 'baalebosofficial@gmail.com', 'securepassword1'),
    ('Ji Masun', 'alldatatechsolu@gmail.com', 'securepassword2')
  ON CONFLICT (email) DO NOTHING;
`);

    console.log('✅ Seeding completed');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await pool.end(); // Properly close the pool
    console.log('🔌 Pool closed');
  }
})();
