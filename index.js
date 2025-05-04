require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artist');
const songRoutes = require('./routes/songs');
const albumRoutes = require('./routes/album');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'client', 'build'))); 

app.use('/auth', authRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/album', albumRoutes);

// app.get('*', (req, res) => {
//   const filePath = path.join(__dirname, 'client', 'build', 'index.html');
//   console.log('Serving index.html from:', filePath);
//   res.sendFile(filePath);
// });

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});