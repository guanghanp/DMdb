/*
  Editor implements a form for creating a new artist or editing an existing
  artist.

  props:
    artist: The artist to be edited [optional]
    complete: A callback to add or save artist

  The complete callback should have one optional argument. Calling complete
  with no arguments cancels the operation. Otherwise complete is invoked with
  the artist object to be added or updated.
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button
} from "reactstrap";

import { ArtistShape } from "./Artist";

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.artist ? props.artist.ArtistName : "",
      description: props.artist ? props.artist.ArtistDescription : "",
      origin: props.artist ? props.artist.Origin : ""
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleName = this.handleTextUpdate.bind(this, "name");
    this.handleDescription = this.handleTextUpdate.bind(this, "description");
    this.handleOrigin = this.handleTextUpdate.bind(this, "origin");
  }

  handleTextUpdate(field, event) {
    this.setState({ [field]: event.target.value });
  }

  handleSave() {
    console.log(this.state);
    const newArtist = {
      ArtistName: this.state.name,
      ArtistDescription: this.state.description,
      Origin: this.state.origin
    };
    this.props.complete(newArtist);
  }

  handleCancel() {
    this.props.complete();
  }

  render() {
    const { name, description, origin } = this.state;

    return (
      <Form>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Artist name"
            value={name}
            onChange={this.handleName}
            invalid={!name}
          />
          <FormFeedback>Name cannot be blank</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="origin">Origin</Label>
          <Input
            id="origin"
            type="text"
            placeholder="Artist Origin"
            value={origin}
            onChange={this.handleOrigin}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Artist Description</Label>
          <Input
            id="description"
            type="textarea"
            placeholder="Artist Description"
            cols="100"
            rows="10"
            value={description}
            onChange={this.handleDescription}
          />
        </FormGroup>
        <div>
          <Button disabled={name === ""} onClick={this.handleSave}>
            Save
          </Button>{" "}
          <Button onClick={this.handleCancel}>Cancel</Button>
        </div>
      </Form>
    );
  }
}

Editor.propTypes = {
  artist: ArtistShape,
  complete: PropTypes.func.isRequired
};

Editor.defaultProps = {
  artist: null
};

export default Editor;
