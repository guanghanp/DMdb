import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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
      Rating: 4
    };
    this.props.complete(newReview);
  }

  handleCancel() {
    this.props.complete();
  }

  render() {
    const { content } = this.state;

    return (
      <Form id="editorComp">
        <FormGroup>
          <Label for="Comment">
            <h3 className="comment-title">New Review</h3>
          </Label>
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
