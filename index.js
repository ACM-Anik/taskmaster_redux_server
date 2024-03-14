require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://taskmaster_redux:TeffZWBBpqaxdrIX@cluster0.vxma4ez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = await client.db('taskmaster_redux');
    const tasksCollection = db.collection('tasks');

    console.log('Successfully connected to MongoDB!');

    app.get('/', (req, res) => {
      res.send('Task Master Server');
    });

    app.get('/tasks', async (req, res) => {
      try {
        const tasks = await tasksCollection.find({}).toArray();
        res.json(tasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/tasks', async (req, res) => {
      const newTask = req.body;

      try {
        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json(result);
      } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

   
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Taskmaster server listening on port ${port}`);
});
