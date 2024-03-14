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
    const db = await client.db('taskmaster');
    const tasksCollection = db.collection('tasks');

    console.log('Successfully connected to MongoDB!');

    app.get('/', (req, res) => {
      res.send('Task Master Server');
    });

   
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Taskmaster server listening on port ${port}`);
});
