import React, { Component } from "react";
import styled from "styled-components";
import { Container, Button } from "react-bootstrap";

import IndexBar from "./components/IndexBar";
import Artist from "./components/Artist";
import Editor from "./components/Editor";
import Soundtrack from "./components/Soundtrack";

const Title = styled.h1`
  text-align: center;
`;

const ButtonBar = styled.div.attrs(() => ({
  className: "bg-light"
}))`
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
`;

class App extends Component {
  constructor() {
    super();

    // Initialize the App state
    this.state = {
      mode: "view",
      currentArtist: undefined,
      currentAlbums: undefined,
      currentSoundtrack: undefined,
      collection: [],
      loggedIn: true
    };

    this.handleEditorReturn = this.handleEditorReturn.bind(this);
    this.handleReviewUpdate = this.handleReviewUpdate.bind(this);
    this.removeArtist = this.removeArtist.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectSoundtrack = this.handleSelectSoundtrack.bind(this);
  }

  componentDidMount() {
    fetch("/api/artist")
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => {
        this.setState({ collection: data, mode: "view" });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleSelect(artist) {
    if (artist) {
      fetch(`/api/artist/${artist.ArtistID}/soundtrack`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(data => {
          var albums = {};
          data.forEach(element => {
            if (albums[element.AlbumID]) {
              albums[element.AlbumID].Soundtracks.push({
                SoundtrackID: element.SoundtrackID,
                SoundtrackName: element.SoundtrackName,
                GenreName: element.GenreName,
                AlbumName: element.AlbumName
              });
            } else {
              albums[element.AlbumID] = {
                AlbumID: element.AlbumID,
                AlbumName: element.AlbumName,
                DateReleased: element.DateReleased,
                Soundtracks:
                  element.SoundtrackID === null
                    ? []
                    : [
                        {
                          SoundtrackID: element.SoundtrackID,
                          SoundtrackName: element.SoundtrackName,
                          GenreName: element.GenreName,
                          AlbumName: element.AlbumName
                        }
                      ]
              };
            }
          });
          this.setState({
            currentArtist: artist,
            currentAlbums: albums,
            currentSoundtrack: undefined
          });
        })
        .catch(err => console.log(err)); // eslint-disable-line no-console
    } else {
      this.setState({
        currentArtist: undefined,
        currentAlbums: undefined,
        currentSoundtrack: undefined
      });
    }
  }

  handleSelectSoundtrack(soundtrack) {
    if (soundtrack) {
      fetch(`/api/soundtrack/${soundtrack.SoundtrackID}/review`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(data => {
          const soundtrackInfo = {
            SoundtrackID: soundtrack.SoundtrackID,
            SoundtrackName: soundtrack.SoundtrackName,
            GenreName: soundtrack.GenreName,
            AlbumName: soundtrack.AlbumName,
            ArtistName: this.state.currentArtist.ArtistName,
            reviews: data
          };
          this.setState({ currentSoundtrack: soundtrackInfo });
          console.log(soundtrackInfo);
        })
        .catch(err => console.log(err)); // eslint-disable-line no-console
    }
  }

  handleReviewUpdate(newReviews) {
    const newInfo = Object.assign({}, this.state.currentSoundtrack, {
      reviews: newReviews
    });
    this.setState({ currentSoundtrack: newInfo });
  }

  handleEditorReturn(newArtist) {
    if (newArtist) {
      // Not a cancel
      if (this.state.currentArtist) {
        // This is a replacement
        const updatedArtist = Object.assign(
          {},
          this.state.currentArtist,
          newArtist
        );

        fetch(`/api/artist/${updatedArtist.ArtistID}`, {
          method: "PUT",
          body: JSON.stringify(updatedArtist),
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json"
          })
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then(fetchedArtist => {
            const modifiedCollection = this.state.collection.map(artist => {
              return artist.ArtistID === fetchedArtist.ArtistID
                ? fetchedArtist
                : artist;
            });

            this.setState({
              collection: modifiedCollection,
              currentArtist: fetchedArtist
            });
          })
          .catch(err => console.log(err)); // eslint-disable-line no-console
      } else {
        // This is a new artist
        fetch("/api/artist", {
          method: "POST",
          body: JSON.stringify(newArtist),
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json"
          })
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then(fetchedArtist => {
            // Create a copy of the collections then append new artist. We need to append
            // the fetched artist so that we pick up the id from the server
            const modifiedCollection = this.state.collection.slice();
            modifiedCollection.push(fetchedArtist);
            this.setState({
              collection: modifiedCollection,
              currentArtist: fetchedArtist
            });
          })
          .catch(err => console.log(err)); // eslint-disable-line no-console
      }
    }
    this.setState({ mode: "view" });
  }

  removeArtist(oldArtist) {
    fetch(`/api/artist/${oldArtist.ArtistID}`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          const modifiedCollection = this.state.collection.filter(
            artist => artist.ArtistID !== oldArtist.ArtistID
          );
          this.setState({
            collection: modifiedCollection,
            currentArtist: null
          });
        }
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  render() {
    const {
      currentArtist,
      mode,
      loggedIn,
      currentAlbums,
      currentSoundtrack
    } = this.state;

    if (mode === "view") {
      const newButton = (
        <Button
          size="sm"
          onClick={() => this.setState({ mode: "edit", currentArtist: null })}
        >
          New Artist
        </Button>
      );
      const editButton = (
        <Button size="sm" onClick={() => this.setState({ mode: "edit" })}>
          Edit Artist
        </Button>
      );

      const deleteButton = (
        <Button
          size="sm"
          onClick={() => {
            this.removeArtist(this.state.currentArtist);
          }}
        >
          Delete Artist
        </Button>
      );

      const loginButton = (
        <Button size="sm" onClick={() => {}}>
          Log In
        </Button>
      );

      const registerButton = (
        <Button size="sm" onClick={() => {}}>
          New User
        </Button>
      );

      let buttons;
      if (loggedIn) {
        buttons = (
          <Container fluid>
            {newButton} {currentArtist && editButton}{" "}
            {currentArtist && deleteButton}{" "}
          </Container>
        );
      } else {
        buttons = (
          <Container fluid>
            {loginButton} {registerButton}
          </Container>
        );
      }

      return (
        <div>
          <Title>DMDb</Title>
          <ButtonBar className="bg-light">{buttons}</ButtonBar>
          <Container fluid>
            <IndexBar
              collection={this.state.collection}
              currentArtist={currentArtist}
              select={this.handleSelect}
            >
              {currentSoundtrack && (
                <Soundtrack
                  Return={() => this.setState({ currentSoundtrack: undefined })}
                  soundtrack={currentSoundtrack}
                  updateReview={this.handleReviewUpdate}
                />
              )}
              {!currentSoundtrack && currentArtist && (
                <Artist
                  artist={currentArtist}
                  albums={currentAlbums}
                  soundtrack={currentSoundtrack}
                  select={this.handleSelectSoundtrack}
                />
              )}
            </IndexBar>
          </Container>
        </div>
      );
    }

    // We are "editing"
    return (
      <div>
        <Title>DMDb</Title>
        <Container fluid>
          <Editor artist={currentArtist} complete={this.handleEditorReturn} />
        </Container>
      </div>
    );
  }
}

export default App;
