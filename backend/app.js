const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

 app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send('Backend API Running');
});

module.exports = app;
