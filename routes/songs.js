const express = require('express');
const axios = require('axios');
const router = express.Router();

let accessToken = '';
let tokenExpiresAt = 0;

//token setup
const getAccessToken = async () => {
    if (Date.now() < tokenExpiresAt) return accessToken;

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }).toString(), {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);
        console.log('Spotify token acquired, expires at:', new Date(tokenExpiresAt));
        return accessToken;
    } catch (error) {
        console.error('Failed to acquire token:', error.response?.data || error.message);
        throw error;
    }
};

//get track
router.get('/:id', async (req, res) => {
    const trackId = req.params.id;

    if (!trackId || trackId.trim() === '') {
        return res.status(400).json({ error: 'Invalid track ID' });
    }

    try {
        const token = await getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;