require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000; // Use the port defined in the .env file or default to 3000

app.use(bodyParser.json());

// In-memory database (array)
let users = [
  {
    id: uuidv4(),
    username: 'John Doe',
    age: 25,
    hobbies: ['Reading', 'Gaming']
  },
  {
    id: uuidv4(),
    username: 'Jane Smith',
    age: 30,
    hobbies: ['Hiking']
  }
];

// GET all users
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// GET user by ID
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!isValidUuid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  const user = users.find(user => user.id === userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// POST create a new user
app.post('/api/users', (req, res) => {
  const { username, age, hobbies } = req.body;
  if (!username || !age) {
    return res.status(400).json({ message: 'Username and age are required' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies || [] // If hobbies are not provided, set to an empty array
  };
  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT update a user by ID
app.put('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!isValidUuid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  const updatedUser = req.body;
  const index = users.findIndex(user => user.id === userId);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    res.status(200).json(users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// DELETE a user by ID
app.delete('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!isValidUuid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Handling non-existing endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware for server-side errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Helper function to validate UUID
function isValidUuid(uuid) {
  return uuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app; // Expose the Express app for each worker
