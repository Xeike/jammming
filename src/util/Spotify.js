const clientID = '9f3a0f657ca443878df48629b03c9d3d';
const redirectURI = 'http://localhost:3000/';

let userAccessToken = '';

const Spotify = {
  getAccessToken() {
    let url = window.location.href;
    let accessToken = url.match(/access_token=([^&]*)/);
    let expiresIn = url.match(/expires_in=([^&]*)/);
    if (userAccessToken) {
      return userAccessToken;
    } else if (accessToken && expiresIn) {
      userAccessToken = accessToken[1];
      let expTime = Number(expiresIn[1]) * 1000;
      window.setTimeout(() => {userAccessToken = '';}, expTime);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers:{Authorization: `Bearer ${userAccessToken}`} })
    .then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
      }
    })
  },

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName && !trackURIs) {
      return ;
    }
    const accessToken = this.getAccessToken();
    const userID = fetch('https://api.spotify.com/v1/me', { headers:{Authorization: `Bearer ${userAccessToken}`} })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.id);
    const playlistID = fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, { 
      method:'POST',
      headers:{Authorization: `Bearer ${userAccessToken}`},
      body:{name:playlistName, public:'false'}
    })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.id);
    
    return fetch(`https://api.spotify.com/v1/users/${userIDd}/playlists/${playlistID}/tracks`, {
      method:'POST',
      headers:{Authorization: `Bearer ${userAccessToken}`},
      body: trackURIs
    });
    
  }
};

export default Spotify;

// step 90
// https://youtu.be/g8zjCVgN32k?t=1h48m47s