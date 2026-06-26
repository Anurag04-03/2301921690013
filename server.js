const express = require('express');
const app = express();
const port = 3000;

// Middleware to log the HTTP method and request URL
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Route: GET /
app.get('/', (req, res) => {
  res.send('Home Page');
});

// Route: POST /login
app.post('/login', (req, res) => {
  res.send('Login Page');
});

// Route: GET /users
app.get('/users', (req, res) => {
  res.send('Users Page');
});

// Route: POST /submit
app.post('/submit', (req, res) => {
  res.send('Submit Page');
});

// Start the server on port 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
