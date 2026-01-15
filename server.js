import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(express.json());

// ============ AUTH API ============

// Login or register user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Try to find existing user
        let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = result.rows[0];

        // If user doesn't exist, create them
        if (!user) {
            const name = email.split('@')[0];
            const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
            result = await pool.query(
                'INSERT INTO users (email, name, avatar) VALUES ($1, $2, $3) RETURNING *',
                [email, name, avatar]
            );
            user = result.rows[0];
        }

        res.json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user by ID
app.get('/api/auth/user/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============ PROMPTS API ============

// Get all prompts for a user
app.get('/api/prompts/:userId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM prompts WHERE owner_id = $1 ORDER BY created_at DESC',
            [req.params.userId]
        );
        // Convert database format to frontend format
        const prompts = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            content: row.content,
            tags: row.tags || [],
            category: row.category,
            ownerId: row.owner_id,
            createdAt: new Date(row.created_at).getTime()
        }));
        res.json(prompts);
    } catch (error) {
        console.error('Get prompts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new prompt
app.post('/api/prompts', async (req, res) => {
    try {
        const { title, content, tags, category, ownerId } = req.body;
        if (!title || !content || !ownerId) {
            return res.status(400).json({ error: 'Title, content, and ownerId are required' });
        }

        const result = await pool.query(
            'INSERT INTO prompts (title, content, tags, category, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, content, tags || [], category || '', ownerId]
        );

        const row = result.rows[0];
        const prompt = {
            id: row.id,
            title: row.title,
            content: row.content,
            tags: row.tags || [],
            category: row.category,
            ownerId: row.owner_id,
            createdAt: new Date(row.created_at).getTime()
        };

        res.status(201).json(prompt);
    } catch (error) {
        console.error('Create prompt error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a prompt
app.put('/api/prompts/:id', async (req, res) => {
    try {
        const { title, content, tags, category } = req.body;
        const result = await pool.query(
            'UPDATE prompts SET title = COALESCE($1, title), content = COALESCE($2, content), tags = COALESCE($3, tags), category = COALESCE($4, category) WHERE id = $5 RETURNING *',
            [title, content, tags, category, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        const row = result.rows[0];
        const prompt = {
            id: row.id,
            title: row.title,
            content: row.content,
            tags: row.tags || [],
            category: row.category,
            ownerId: row.owner_id,
            createdAt: new Date(row.created_at).getTime()
        };

        res.json(prompt);
    } catch (error) {
        console.error('Update prompt error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a prompt
app.delete('/api/prompts/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM prompts WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prompt not found' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Delete prompt error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============ STATIC FILES ============

// Serve static files from dist
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PromptOzer running on port ${PORT}`);
});
