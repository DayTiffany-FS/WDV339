import './App.css';
import spotifyLogo from './spotify-logo.svg'; 
import blackLogo from './spotify-logo-black.svg';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ artists: [], albums: [], tracks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const encodedQuery = encodeURIComponent(searchQuery);
  
    Promise.all([
      fetch(`/api/artist/search?q=${encodedQuery}&type=artist`).then(res => res.json()),
      fetch(`/api/artist/search?q=${encodedQuery}&type=album`).then(res => res.json()),
      fetch(`/api/artist/search?q=${encodedQuery}&type=track`).then(res => res.json())
    ])
    .then(([artistData, albumData, trackData]) => {
      setResults({
        artists: artistData.items || [],
        albums: albumData.items || [],
        tracks: trackData.items || [],
      });
      setLoading(false);
    })
    .catch(err => {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      setLoading(false);
    });
  }  

  function handleLogin() {
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token); 
          setIsLoggedIn(true);
        }
      })
      .catch(err => console.error('Error:', err));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={blackLogo} alt="Spotify Logo in Black" className="logo" />
        <form className="search-bar" onSubmit={handleSearch}>
          <FaSearch color="white" />
          <input
            type="text"
            placeholder="Search for artist..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>
      </header>

      {isLoggedIn ? (
        <main className="App-main">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (results.artists.length > 0 || results.albums.length > 0 || results.tracks.length > 0) ? (
            <>
              {results.artists.length > 0 && (
                <div>
                  <h2>Artists</h2>
                  <div className="results-grid">
                    {results.artists.map((artist, index) => (
                      <div key={index} className="result-item">
                        <h3>{artist.name}</h3>
                        <p>{artist.genres?.join(', ')}</p>
                        {artist.images?.[0] && <img src={artist.images[0].url} alt={artist.name} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.albums.length > 0 && (
                <div>
                  <h2>Albums</h2>
                  <div className="results-grid">
                    {results.albums.map((album, index) => (
                      <div key={index} className="result-item">
                        <h3>{album.name}</h3>
                        <p>{album.artists?.map(a => a.name).join(', ')}</p>
                        {album.images?.[0] && <img src={album.images[0].url} alt={album.name} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.tracks.length > 0 && (
                <div>
                  <h2>Tracks</h2>
                  <div className="results-grid">
                    {results.tracks.map((track, index) => (
                      <div key={index} className="result-item">
                        <h3>{track.name}</h3>
                        <p>{track.artists?.map(a => a.name).join(', ')}</p>
                        {track.album?.images?.[0] && <img src={track.album.images[0].url} alt={track.name} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <img src={spotifyLogo} alt="Spotify Icon" className="spotify-icon" />
              <h2>No Results</h2>
              <p>Please type in a search query to get started…</p>
            </div>
          )}
        </main>
      ) : (
        <main className="App-main">
          <h2>Please Login</h2>
          <p>In order to search for artists, tracks, or songs you must login to your Spotify account</p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
          />
          <button className="login-button" onClick={handleLogin}>Login</button>
        </main>
      )}
    </div>
  );  
}

export default App;