import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import StarRatings from "react-star-ratings";
import styled from "styled-components";

const RatingContainer = styled.div`
  margin: 5px;
  margin-bottom: 20px;
`;

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      rating: 3
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }

  handleSave() {
    const now = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const newReview = {
      Review: this.state.content,
      TimeCreated: now,
      Likes: 0,
      Rating: this.state.rating
    };
    this.props.complete(newReview);
  }

  handleCancel() {
    this.props.complete();
  }

  changeRating(newRating, name) {
    this.setState({
      rating: newRating
    });
  }

  render() {
    const { content } = this.state;
    return (
      <Form id="editorComp">
        <FormGroup>
          <Label for="Comment">
            <h3 className="comment-title">New Review</h3>
          </Label>
          <RatingContainer>
            Rating:{" "}
            <StarRatings
              rating={this.state.rating}
              changeRating={this.changeRating}
              starDimension="20px"
              starSpacing="1px"
              numberOfStars={5}
            />
          </RatingContainer>
          <Input
            id="comment"
            name="textInput"
            type="textarea"
            placeholder="Enter your new review here"
            cols="80"
            rows="5"
            value={content}
            onChange={e => this.setState({ content: e.target.value })}
          />
        </FormGroup>
        <div>
          <Button
            color="primary"
            disabled={content === ""}
            onClick={this.handleSave}
          >
            Save
          </Button>{" "}
          <Button color="primary" onClick={this.handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    );
  }
}

export default Review;
