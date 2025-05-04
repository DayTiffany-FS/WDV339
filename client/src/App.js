import './App.css';
import spotifyLogo from './spotify-logo.svg'; 
import blackLogo from './spotify-logo-black.svg';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    console.log('Login button clicked');
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
          console.log('Login successful:', data.token);
          localStorage.setItem('token', data.token); 
          setIsLoggedIn(true);
        } else {
          console.error('Login failed:', data.error || data);
        }      
      })
      .catch(err => console.error('Error:', err));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={blackLogo} alt="Spotify Logo in Black" className="logo" />
      </header>
  
      {isLoggedIn ? (
        <main className="App-main">
          <div className="search-header">
            <img src={spotifyLogo} alt="Spotify Logo" className="spotify-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for artist..."
            />
          </div>
          <div className="no-results">
            <img src={spotifyLogo} alt="Spotify Icon" className="spotify-icon" />
            <h2>No Results</h2>
            <p>Please type in a search query to get started…</p>
          </div>
        </main>
      ) : (
        <main className="App-main">
          <img src={spotifyLogo} alt="Spotify Icon" className="spotify-icon" />
          <h2>Please Login</h2>
          <p>
            In order to search for artists, tracks, or songs you must login to your Spotify account
          </p>
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