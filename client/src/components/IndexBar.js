/*
  IndexBar displays the list of sections (first letter) for the collection of
  aritst passed down in its props. Clicking on one of these sections displays
  a list of the available artists.

  props:
    collection: A list of all artists
    select: A callback when artist is selected
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import styled from "styled-components";

import { ArtistShape } from "./Artist";

const SectionItem = styled(ListGroupItem)`
  font-weight: bold;
  padding: 0.4rem;
`;

const TitleItem = styled.li``;

/*
  Sections headers sub-component in the IndexBar.
  props:
    currentSection - the current section
    sections - the list of the available sections
    setSection - a callback for when a section has been selected
*/
export function IndexSections(props) {
  const { currentSection, sections, setSection } = props;

  // Build the list of sections
  const sectionItems = sections.map(section => (
    <SectionItem
      key={section}
      active={section === currentSection}
      onClick={() => {
        setSection(section);
      }}
    >
      {section}
    </SectionItem>
  ));

  return (
    <div>
      <ListGroup className="list-group-horizontal mb-2">
        {sectionItems}
      </ListGroup>
    </div>
  );
}

IndexSections.propTypes = {
  currentSection: PropTypes.string,
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSection: PropTypes.func.isRequired
};

IndexSections.defaultProps = {
  currentSection: undefined
};

/*
  Title list sub-component in the IndexBar.
  props:
    artists - the list of artists to be displayed
    select - the callback to indicate which name has been selected
*/
export function IndexTitles(props) {
  // Sort the aritsts by name
  const { artists, select } = props;
  artists.sort((a1, a2) => a1.ArtistName.localeCompare(a2.ArtistName));

  // Assemble the list of titles
  const titles = artists.map(artist => (
    <TitleItem
      key={artist.ArtistName}
      onClick={() => {
        select(artist);
      }}
    >
      {artist.ArtistName}
    </TitleItem>
  ));

  return (
    <div>
      <ul className="list-unstyled">{titles}</ul>
    </div>
  );
}

IndexTitles.propTypes = {
  artists: PropTypes.arrayOf(ArtistShape).isRequired,
  select: PropTypes.func.isRequired
};

const toSection = function nameToSection(artist) {
  console.log(artist);
  return artist.ArtistName[0].toUpperCase();
};

const toSections = function artistsToSections(artists) {
  const sections = new Set();
  artists.forEach(artist => {
    if (artist.ArtistName) {
      sections.add(toSection(artist));
    }
  });
  return Array.from(sections).sort();
};

class IndexBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      section: props.currentArtist ? toSection(props.currentArtist) : undefined
    };

    this.handleSectionChange = this.handleSectionChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentArtist) {
      return { section: toSection(props.currentArtist) };
    } else if (!state.section) {
      const sections = toSections(props.collection);
      return { section: sections[0] };
    }

    return null;
  }

  handleSectionChange(newSection) {
    if (newSection !== this.state.section) {
      this.setState({ section: newSection });
      this.props.select(); // Deselect any current artist
    }
  }

  render() {
    const { collection, select } = this.props;
    const { section } = this.state;

    // Conditionally create the title list if we have a selected section
    let names;
    if (section) {
      const artists = collection.filter(
        artist => toSection(artist) === section
      );
      names = <IndexTitles artists={artists} select={select} />;
    } else {
      names = <p style={{ textAlign: "center" }}>Select a section</p>;
    }

    return (
      <div>
        <Row className="justify-content-center">
          <Col xs="auto">
            <IndexSections
              currentSection={section}
              sections={toSections(collection)}
              setSection={this.handleSectionChange}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={3}>
            {names}
          </Col>
          <Col>{this.props.children}</Col>
        </Row>
      </div>
    );
  }
}

IndexBar.propTypes = {
  collection: PropTypes.arrayOf(ArtistShape).isRequired,
  select: PropTypes.func.isRequired,
  currentArtist: ArtistShape
};

IndexBar.defaultProps = {
  currentArtist: null
};

export default IndexBar;
