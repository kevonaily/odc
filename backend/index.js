require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: 5432,
});

app.get('/api/users', async(__, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({error: 'Internal server error'});
  }
}
);
app.post('/api/users', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *',
      [first_name, last_name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *',
      [first_name, last_name, email, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
