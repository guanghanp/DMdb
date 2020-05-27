/*
  Soundtrack displays the information about a sound track, and reviews of this soundtrack

  props:
    Artist: Artist to display
    Albums: albums to display
*/

import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Annotation.css";
import Review from "./Review";
import PropTypes from "prop-types";
import styled from "styled-components";

const Name = styled.h2``;

const Info = styled.div`
  margin-left: 0;
  margin-top: 20px;
`;

class Soundtrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    this.UserID = 1;

    this.handleEditorReturn = this.handleEditorReturn.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.removeComment = this.removeComment.bind(this);
  }

  handleEditorReturn(newReview) {
    if (newReview) {
      const newData = Object.assign({}, newReview, {
        UserID: this.UserID,
        SoundtrackID: this.props.soundtrack.SoundtrackID
      });
      fetch(`/api/review`, {
        method: "POST",
        body: JSON.stringify(newData),
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json"
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.status_text);
          }
          return response.json();
        })
        .then(() => {
          const newReviews = this.props.soundtrack.reviews;
          const review = Object.assign({}, newReview, { Username: "test" });
          newReviews.push(review);
          this.props.updateReview(newReviews);
        })
        .catch(err => console.log(err));
    }
    this.setState({ editing: false });
  }

  removeComment(oldReview) {
    // TODO
  }

  handleNew() {
    this.setState({ editing: true });
  }

  render() {
    const {
      soundtrack: { SoundtrackName, GenreName, AlbumName, ArtistName, reviews },
      Return
    } = this.props;
    const { editing } = this.state;

    const reviewList = reviews.map((review, i) => {
      return (
        <div key={i} className="comment-container">
          <div className="comment-text">{review.Review}</div>
          <div className="row">
            {/* <button
              className="btn btn-link"
              onClick={() => {
                this.removeComment(review);
              }}
            >
              Delete
            </button> */}
            <p className="review-info">
              By:{review.Username},
              {new Date(review.TimeCreated).toLocaleString()}
            </p>
          </div>
          <hr className="divider" />
        </div>
      );
    });

    const returnButton = (
      <Button onClick={Return} className="return-button">
        Return to Artist
      </Button>
    );

    const addButton = (
      <Button className="add-button" onClick={this.handleNew}>
        Add New Review
      </Button>
    );

    const editorSection = (
      <Container className="editor-container">
        {editing && <Review complete={this.handleEditorReturn} />}
      </Container>
    );

    return (
      <Container className="content">
        {returnButton}
        <Name>{SoundtrackName}</Name>
        <Info>
          <b>Artist: </b>
          {ArtistName}
        </Info>
        <Info>
          <b>Album: </b>
          {AlbumName}
        </Info>
        <Info>
          <b>Genre: </b>
          {GenreName}
        </Info>
        <Row className="annotation-row">
          <Col xs={12} md={12} lg={12}>
            <h5>Reviews:</h5>
            <Container fluid className="annotation-box">
              {reviewList}
            </Container>
          </Col>
        </Row>
        <Row className="anno-buttons">{addButton}</Row>
        <Row className="add-row">{editorSection}</Row>
      </Container>
    );
  }
}

Soundtrack.propTypes = {
  Return: PropTypes.func.isRequired,
  soundtrack: PropTypes.object.isRequired
};

export default Soundtrack;
