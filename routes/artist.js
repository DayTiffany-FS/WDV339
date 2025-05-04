const express = require('express');
const axios = require('axios');
const router = express.Router();

let accessToken = '';
let tokenExpiresAt = 0;

//token setup
const getAccessToken = async() => {
    if(Date.now() < tokenExpiresAt) return accessToken;

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing spotify client credentials in env variables');
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
        throw error;
    }
};

//search by artist
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Missing search information' });
    }

    try {
        const token = await getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q,
                type: 'artist',
                limit: 5
            }
        });
        res.json(response.data.artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//search by artist id
router.get('/:id', async (req, res) => {
    try {
        const token = await getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// //artist albums
// router.get('/:id/albums', async (req, res) => {
//     try {
//         const token = await getAccessToken();
//         const {id} = req.params;
//         const {limit = 5, offset =0, include_groups = 'album,single', market = 'US'} = req.query;

//         const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
//             headers: { Authorization: `Bearer ${token}`},
//             params: {
//                 limit,
//                 offset,
//                 include_groups,
//                 market
//             }
//         });
//         res.json(response.data)
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// //artist top tracks
// router.get('/:id/top-tracks', async (req, res) => {
//     try {
//         const token = await getAccessToken();
//         const { id } = req.params;
//         const { market = 'US' } = req.query;
//         const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
//             headers: {Authorization: `Bearer ${token} `},
//             params: {market}
//         });
//         res.json(response.data)
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;