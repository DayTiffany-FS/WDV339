const express = require('express');
const axios = require('axios');
const router = express.Router();

let accessToken = '';
let tokenExpiresAt = 0;

const getAccessToken = async() => {
    if(Date.now() < tokenExpiresAt) return accessToken;

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Spotify Client ID and Client Secret must be defined in environment variables');
    }

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
    tokenExpiresAt= Date.now() + (response.data.expires_in * 1000);

    console.log('Spotify token acquired');
    return accessToken;
    } catch (error) {
        console.error('Failed to acquire token:', error.response?.data || error.message);
        throw new Error('Could not retrieve Spotify access token.');
    }
};

const fetchSpotifyData = async (url, token) => {
    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Spotify data:', error.response?.data || error.message);
        throw new Error('Failed to fetch data from Spotify API');
    }
};

router.get('/:id', async (req, res) => {
    try {
        const token = await getAccessToken();
        const data = await fetchSpotifyData(`https://api.spotify.com/v1/albums/${req.params.id}`, token);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.get('/:id/tracks', async (req, res) => {
//     try {
//         const token = await getAccessToken();
//         const data = await fetchSpotifyData(`https://api.spotify.com/v1/albums/${req.params.id}/tracks`, token);
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;