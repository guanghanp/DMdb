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

const Name = styled.h3``;
const Description = styled.div``;
const OriginStyle = styled.p`
  font-size: small;
`;

export const ArtistShape = PropTypes.shape({
  ArtistName: PropTypes.string,
  ArtistDescription: PropTypes.string,
  Origin: PropTypes.string
});

class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentSoundtrack: undefined
    };
  }

  render() {
    const {
      artist: { ArtistName, ArtistDescription, Origin },
      albums
    } = this.props;

    return (
      <ArtistContainer>
        <Name>{ArtistName}</Name>
        <OriginStyle>{Origin}</OriginStyle>
        <Description>{ArtistDescription}</Description>
      </ArtistContainer>
    );
  }
}

Artist.propTypes = {
  Artist: ArtistShape
};

export default Artist;
