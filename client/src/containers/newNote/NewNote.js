import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import { LoaderButton } from '../../components';
import { invokeApi, s3Upload, size } from '../../libs';
import './NewNote.css';

class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.state = {
      isLoading: null,
      content: '',
    };
  }
  _validateForm() {
    return this.state.content.length > 0;
  }
  _handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }
  _handleFileChange = (event) => {
    this.file = event.target.files[0];
  }
  _handleSubmit = async (event) => {
    event.preventDefault();
    if (this.file && this.file.size > size) {
      alert('Please pick a file smaller than 5MB');
      return;
    }
    this.setState({ isLoading: true });
    try {
      const uploadedFilename = (this.file)
        ? await s3Upload(this.file, this.props.userToken)
        : null;
      await this._createNote({
        content: this.state.content,
        attachment: uploadedFilename,
      });
      this.props.history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  _createNote(note) {
    return invokeApi({
      path: '/notes',
      method: 'POST',
      body: note,
    }, this.props.userToken);
  }
  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this._handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this._handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl
              onChange={this._handleFileChange}
              type="file"
            />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this._validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}

export default withRouter(NewNote);
