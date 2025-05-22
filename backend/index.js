require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { body, param, query, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: 5432,
});

// Middleware pour vérifier les erreurs de validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  next();
};

// Middleware pour vérifier si un utilisateur existe
const checkUserExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// GET - Récupérer tous les utilisateurs avec pagination et recherche
app.get('/api/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('La page doit être un nombre entier positif'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('La limite doit être entre 1 et 100'),
  query('search').optional().isString().withMessage('Le terme de recherche doit être une chaîne de caractères'),
  validateRequest
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query, countQuery, params = [];
    
    if (search) {
      query = `
        SELECT * FROM users 
        WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
        ORDER BY id DESC LIMIT $2 OFFSET $3
      `;
      countQuery = `
        SELECT COUNT(*) FROM users 
        WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
      `;
      params = [`%${search}%`, limit, offset];
    } else {
      query = 'SELECT * FROM users ORDER BY id DESC LIMIT $1 OFFSET $2';
      countQuery = 'SELECT COUNT(*) FROM users';
      params = [limit, offset];
    }

    const result = await pool.query(query, params);
    const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
    
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users: result.rows,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET - Récupérer un utilisateur par ID
app.get('/api/users/:id', [
  param('id').isInt().withMessage('L\'ID doit être un nombre entier'),
  validateRequest,
  checkUserExists
], async (req, res) => {
  res.status(200).json(req.user);
});

// POST - Créer un nouvel utilisateur
app.post('/api/users', [
  body('first_name').notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('last_name').notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email').notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Format d\'email invalide')
    .custom(async (email) => {
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        throw new Error('Cet email est déjà utilisé');
      }
      return true;
    }),
  validateRequest
], async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *',
      [first_name, last_name, email]
    );
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// PUT - Mettre à jour un utilisateur
app.put('/api/users/:id', [
  param('id').isInt().withMessage('L\'ID doit être un nombre entier'),
  body('first_name').notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('last_name').notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email').notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Format d\'email invalide')
    .custom(async (email, { req }) => {
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, req.params.id]);
      if (existingUser.rows.length > 0) {
        throw new Error('Cet email est déjà utilisé par un autre utilisateur');
      }
      return true;
    }),
  validateRequest,
  checkUserExists
], async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [first_name, last_name, email, id]
    );
    res.status(200).json({
      message: 'Utilisateur mis à jour avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// DELETE - Supprimer un utilisateur
app.delete('/api/users/:id', [
  param('id').isInt().withMessage('L\'ID doit être un nombre entier'),
  validateRequest,
  checkUserExists
], async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
