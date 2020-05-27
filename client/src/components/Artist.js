/*
  Artist displays the information about an Artist

  props:
    Artist: Artist to display
    Albums: albums to display
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ArtistContainer = styled.div`
  margin: 40px;
`;

const Name = styled.h2``;
const Description = styled.div``;
const OriginStyle = styled.p`
  font-size: small;
`;

const BreakLine = styled.hr`
  height: 1px;
  border-width: 0;
  color: gray;
  background-color: gray;
  width: 150px;
  text-align: left;
  margin-left: 0;
  margin-top: 0;
`;

const AlbumContainer = styled.div`
  display: block;
  margin-top: 30px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
`;
const AlbumName = styled.h5``;
const SoundtrackItem = styled.li`
  cursor: pointer;
  width: auto;
`;

export const ArtistShape = PropTypes.shape({
  ArtistName: PropTypes.string,
  ArtistDescription: PropTypes.string,
  Origin: PropTypes.string
});

function toList(Soundtracks, select) {
  const Soundtracklist = Soundtracks.map(Soundtrack => (
    <SoundtrackItem
      key={Soundtrack.SoundtrackID}
      onClick={() => select(Soundtrack)}
    >
      {Soundtrack.SoundtrackName}
    </SoundtrackItem>
  ));

  return (
    <div>
      <ul className="list-unstyled">{Soundtracklist}</ul>
    </div>
  );
}

export function Albumslist(props) {
  // Sort the aritsts by name
  const { albums, select } = props;

  // Assemble the list of titles
  const list = Object.keys(albums).map(key => (
    <AlbumContainer key={albums[key].AlbumID}>
      <AlbumName>{albums[key].AlbumName}</AlbumName>
      <BreakLine />
      {toList(albums[key].Soundtracks, select)}
    </AlbumContainer>
  ));

  return (
    <div>
      <ul className="list-unstyled">{list}</ul>
    </div>
  );
}

class Artist extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const {
      artist: { ArtistName, ArtistDescription, Origin },
      albums,
      select
    } = this.props;

    return (
      <ArtistContainer>
        <Name>{ArtistName}</Name>
        <OriginStyle>{Origin}</OriginStyle>
        <Description>{ArtistDescription}</Description>
        <Albumslist albums={albums} select={select} />
      </ArtistContainer>
    );
  }
}

Artist.propTypes = {
  Artist: ArtistShape
};

export default Artist;
