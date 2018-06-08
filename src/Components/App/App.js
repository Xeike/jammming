import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      searchResults: [
        { id:"1", name:"Tiny Dancer", artist:"Elton John", album:"Madman," },
        { id:"2", name:"Tiny Dancer", artist:"Tim McGraw", album:"Hello" },
        { id:"3", name:"Tiny Dancer", artist:"Rockabilly Baby!", album:"Madman", },
        { id:"4", name:"Tiny Dancer", artist:"The Rave", album:"From", },
        { id:"5", name:"Tiny Dancer Live", artist:"Ben Folds", album:"PHX", }
      ],
      playlistName: "My New Playlist",
      playlistTracks: [
        { id:"101", name:"Stronger", artist:"Britney Spears", album:"Oops!... I Did It Again" },
        { id:"102", name:"So Emotional", artist:"Whitney Houston", album:"Whitney" },
        { id:"103", name:"It's Not Right But It's Okay", artist:"Whitney Houston", album:"My Love Is Your Love" },
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if ( this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let tracks = this.state.playlistTracks;
      tracks.push(track);
      this.setState({ playlistTracks:tracks });
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({ playlistTracks:tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      console.log(tracks);
      this.setState({ searchResults: tracks });
   });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;