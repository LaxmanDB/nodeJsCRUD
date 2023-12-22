"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
require('dotenv').config(); // Load environment variables from .env file
var express = require('express');
var bodyParser = require('body-parser');
var _require = require('uuid'),
  uuidv4 = _require.v4;
var app = express();
// const port = process.env.PORT || 3000; // Use the port defined in the .env file or default to 3000

app.use(bodyParser.json());

// In-memory database (array)
var users = [{
  id: uuidv4(),
  username: 'John Doe',
  age: 25,
  hobbies: ['Reading', 'Gaming']
}, {
  id: uuidv4(),
  username: 'Jane Smith',
  age: 30,
  hobbies: ['Hiking']
}];

// GET all users
app.get('/api/users', function (req, res) {
  res.status(200).json(users);
});

// GET user by ID
app.get('/api/users/:userId', function (req, res) {
  var userId = req.params.userId;
  if (!isValidUuid(userId)) {
    return res.status(400).json({
      message: 'Invalid userId'
    });
  }
  var user = users.find(function (user) {
    return user.id === userId;
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({
      message: 'User not found'
    });
  }
});

// POST create a new user
app.post('/api/users', function (req, res) {
  var _req$body = req.body,
    username = _req$body.username,
    age = _req$body.age,
    hobbies = _req$body.hobbies;
  if (!username || !age) {
    return res.status(400).json({
      message: 'Username and age are required'
    });
  }
  var newUser = {
    id: uuidv4(),
    username: username,
    age: age,
    hobbies: hobbies || [] // If hobbies are not provided, set to an empty array
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update a user by ID
app.put('/api/users/:userId', function (req, res) {
  var userId = req.params.userId;
  if (!isValidUuid(userId)) {
    return res.status(400).json({
      message: 'Invalid userId'
    });
  }
  var updatedUser = req.body;
  var index = users.findIndex(function (user) {
    return user.id === userId;
  });
  if (index !== -1) {
    users[index] = _objectSpread(_objectSpread({}, users[index]), updatedUser);
    res.status(200).json(users[index]);
  } else {
    res.status(404).json({
      message: 'User not found'
    });
  }
});

// DELETE a user by ID
app["delete"]('/api/users/:userId', function (req, res) {
  var userId = req.params.userId;
  if (!isValidUuid(userId)) {
    return res.status(400).json({
      message: 'Invalid userId'
    });
  }
  var index = users.findIndex(function (user) {
    return user.id === userId;
  });
  if (index !== -1) {
    users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({
      message: 'User not found'
    });
  }
});

// Handling non-existing endpoints
app.use(function (req, res) {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

// Error handling middleware for server-side errors
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error'
  });
});

// Helper function to validate UUID
function isValidUuid(uuid) {
  return uuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/);
}

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

module.exports = app; // Expose the Express app for each worker