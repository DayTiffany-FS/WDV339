require('dotenv').config()
const express = require('express')
const axios = require('axios')

const authRoutes = require('./routes/login')

const app = express()
const PORT = 8000;

const artistRoutes = require('./routes/artist');
const songRoutes = require('./routes/song');
const albumRoutes = require('./routes/album');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/song', songRoutes);
app.use('/api/album', albumRoutes);

app. get('/', async (req, res) => {
    res.json({ message: "Welcome to the Spotify API App"})
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})