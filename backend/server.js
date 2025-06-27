const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb'); 
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Check for required environment variables
if (!process.env.MONGO_URI || !process.env.DB_NAME) {
    console.error('❌ Missing environment variables (MONGO_URI, DB_NAME)');
    process.exit(1);
}

// MongoDB connection
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}
connectDB();

// Express app setup
const dbName = process.env.DB_NAME;
const collectionName = 'passwords';
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ Get all saved credentials
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const credentials = await collection.find({}).toArray();
        res.json(credentials);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/', async (req, res) => {
    try {
        const { username, site, password } = req.body;
        if (!username || !site || !password) {
            return res.status(400).json({ error: 'Username, site, and password are required' });
        }

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertOne({ username, site, password });

        res.json({ success: true, message: 'Credential saved successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Delete a credential by ID
app.delete('/', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'ID is required' });

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) return res.status(404).json({ error: 'Credential not found' });

        res.json({ success: true, message: 'Credential deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
