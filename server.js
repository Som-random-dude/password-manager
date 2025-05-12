const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./public/modals/user'); // Make sure the path to your user model is correct

// Mongoose connection (Updated Code)
mongoose.connect("mongodb+srv://aamosh65:PasswordPal@passwordpal.bh0qtjv.mongodb.net/PasswordPal?retryWrites=true&w=majority&appName=PasswordPal", {
})
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mainPage.html'));
});

// User Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('❌ User not found');
    }

    if (user.password !== password) {
      return res.status(401).send('❌ Incorrect password');
    }

    res.send('✅ Login successful!');
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error');
  }
});

// User Sign-Up Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('❌ Username already exists');
    }

    // Create a new user with the provided details
    const newUser = new User({ username, email, password });

    // Save the user data into the database
    await newUser.save();

    // Send a success response
    res.send('Signup successful!');
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send('Signup failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
