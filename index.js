require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const uri = process.env.DATABASE_URI;
// console.log(uri);
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
    const usersCollection = db.collection('users');

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

    app.delete('/tasks/:id', async (req, res) => {
      const taskId = req.params.id;
      
      try {
        const result = await tasksCollection.deleteOne({
          _id: new ObjectId(taskId),
        });

        if (result.deletedCount === 0) {
          res.status(404).json({ error: 'Task not found!' });
        } else {
          res.json({ message: 'Task deleted successfully!' });
        }
      } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.patch('/tasks/:id', async (req, res) => {
      const taskId = req.params.id;
      const updatedTaskData = req.body;

      try {
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(taskId) },
          { $set: updatedTaskData }
        );

        if (result.matchedCount === 0) {
          res.status(404).json({ error: 'Task not found' });
        } else {
          res.json({ message: 'Task updated successfully' });
        }
      } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Users/Members:--
    app.get('/users', async (req, res) => {
      try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
      } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      try {
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json(result);
      } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.patch('/users/:id', async (req, res) => {
      const userId = req.params.id;
      const updatedUserData = req.body;

      try {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: updatedUserData }
        );

        if (result.matchedCount === 0) {
          res.status(404).json({ error: 'user not found' });
        } else {
          res.json({ message: 'user updated successfully' });
        }
      } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;
      try {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId)});

        if (result.deletedCount === 0) {
          res.status(404).json({ error: 'User not found!' });
        } else {
          res.json({ message: 'User deleted successfully!' });
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
   
  } finally {}
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Taskmaster server listening on port ${port}`);
});
