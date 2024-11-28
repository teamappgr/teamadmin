require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import PostgreSQL Pool
const http = require('http');
const bodyParser = require('body-parser');
const router = express.Router();

const PORT = process.env.PORT || 5000;


const app = express();
const server = http.createServer(app);


// Retrieve VAPID keys from environment variables
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

// Ensure keys are present
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('VAPID keys are missing. Please check your environment variables.');
  process.exit(1); // Exit the application if keys are not set
}



// Log the VAPID keys to verify they're correctly loaded (remove this in production)

// Middleware for parsing cookies and JSON
app.use(express.json());
app.use(bodyParser.json()); // For parsing application/json
app.set('trust proxy', 1); // Trust Render's proxy

app.use(cors({
    origin: '*', // Allow all origins (use with caution, only for debugging)
    credentials: true, // Allow credentials (cookies)
  }));
  
  


// Database connection pool
const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DATABASE,
  port: process.env.SUPABASE_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

app.get('/ads', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, title, description, created_at, min, max, date, time, verified, available, info FROM ads WHERE verified IS NULL',
            []
          );
                res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: 'Error fetching ads' });
    }
  });
// Endpoint to verify an ad
app.put('/ads/:id/verify', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'UPDATE ads SET verified = true WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Ad not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error verifying ad:', error);
      res.status(500).json({ message: 'Error verifying ad' });
    }
  });
  
  // Endpoint to reject an ad
  app.put('/ads/:id/reject', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'UPDATE ads SET verified = false WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Ad not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error rejecting ad:', error);
      res.status(500).json({ message: 'Error rejecting ad' });
    }
  });
  app.get('/users', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, first_name, last_name, email, phone, instagram_account, image_url, verified, university, gender FROM users WHERE verified IS NULL',
            []
          );
                res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: 'Error fetching ads' });
    }
  });
  app.put('/users/:id/verify', async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await pool.query(
        'UPDATE users SET verified = TRUE WHERE id = $1 RETURNING *', [id]
      );
  
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ message: 'User verified successfully', user: result.rows[0] });
    } catch (error) {
      console.error('Error verifying user:', error);
      res.status(500).json({ message: 'Error verifying user' });
    }
  });
  
  // Route to reject user
  app.put('/users/:id/reject', async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await pool.query(
        'UPDATE users SET verified = false WHERE id = $1 RETURNING *', [id]
      );
  
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ message: 'User rejected successfully', user: result.rows[0] });
    } catch (error) {
      console.error('Error rejecting user:', error);
      res.status(500).json({ message: 'Error rejecting user' });
    }
  });
  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
