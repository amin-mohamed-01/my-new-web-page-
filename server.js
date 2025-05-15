const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5500;
const DATA_FILE = 'file.json';

app.use(cors());
app.use(bodyParser.json());

// Serve static files (CSS, JS, images) or any other static assets you want to serve
// If you need to serve static files, uncomment the next line
// app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root
app.get('/', (req, res) => {
  console.log('GET request received on /');
  res.sendFile(path.join(__dirname, 'index.html')); // Ensure 'index.html' is in the same directory as this file
});

// Handle the signup POST request and save user data
app.post('/signup', (req, res) => {
  console.log('POST request received on /signup');
  const newUser = req.body;

  // Check if the data file exists, if not, create it
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }

  // Read the existing data from the file
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read file:', err);
      return res.status(500).json({ message: 'Failed to read data' });
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing data:', parseError);
      return res.status(500).json({ message: 'Error in saved data' });
    }

    // Add the new user to the data
    users.push(newUser);

    // Save the updated data back to the file
    fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Failed to save:', writeErr);
        return res.status(500).json({ message: 'Failed to save data' });
      }

      res.status(200).json({ message: 'User saved successfully' });
    });
  });
});

// Start the server on a specific IP address
const ip = '192.168.1.19'; // Ensure this is the correct local IP address
app.listen(PORT, ip, () => {
  console.log(`🚀 Server running on http://${ip}:${PORT}`);
});

// Handle any uncaught exceptions to prevent the server from crashing
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Do not exit immediately; handle the error and log it
});

// Handle SIGINT (Ctrl+C) for graceful shutdown
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  process.exit(); // Gracefully shut down the server
});

