import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import { LoaderButton } from '../../components';
import { invokeApi, s3Upload, size } from '../../libs';
import './Notes.css';

class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: '',
    };
  }
  async componentWillMount() {
    try {
      const results = await this._getNote();
      this.setState({
        note: results,
        content: results.content,
      });
    } catch (e) {
      alert(e);
    }
  }
  _getNote() {
    return invokeApi({ path: `/notes/${this.props.match.params.id}` }, this.props.userToken);
  }
  _validateForm() {
    return this.state.content.length > 0;
  }
  _formatFilename(str) {
    return (str.length < 50)
      ? str
      : `${str.substr(0, 20)}...${str.substr(str.length - 20, str.length)}`;
  }
  _handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }
  _handleFileChange = (event) => {
    this.file = event.target.files[0];
  }
  _handleSubmit = async (event) => {
    let uploadedFilename;
    event.preventDefault();
    if (this.file && this.file.size > size) {
      alert('Please pick a file smaller than 5MB');
      return;
    }
    this.setState({ isLoading: true });
    try {
      if (this.file) {
        uploadedFilename = await s3Upload(this.file, this.props.userToken);
      }
      await this._saveNote({
        ...this.state.note,
        content: this.state.content,
        attachment: uploadedFilename || this.state.note.attachment,
      });
      this.props.history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  _handleDelete = async (event) => {
    event.preventDefault();
    const confirmed = confirm('Are you sure you want to delete this note?');
    if (!confirmed) {
      return;
    }
    this.setState({ isDeleting: true });
    try {
      await this._deleteNote();
      this.props.history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }
  _saveNote(note) {
    return invokeApi({
      path: `/notes/${this.props.match.params.id}`,
      method: 'PUT',
      body: note,
    }, this.props.userToken);
  }
  _deleteNote() {
    return invokeApi({
      path: `/notes/${this.props.match.params.id}`,
      method: 'DELETE',
    }, this.props.userToken);
  }
  render() {
    return (
      <div className="Notes">
        { this.state.note &&
          (<form onSubmit={this._handleSubmit}>
              <FormGroup controlId="content">
                <FormControl
                  onChange={this._handleChange}
                  value={this.state.content}
                  componentClass="textarea"
                />
              </FormGroup>
              { this.state.note.attachment &&
              (<FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={this.state.note.attachment}
                  >
                    { this._formatFilename(this.state.note.attachment) }
                  </a>
                </FormControl.Static>
              </FormGroup>)}
              <FormGroup controlId="file">
                { !this.state.note.attachment &&
                <ControlLabel>Attachment</ControlLabel> }
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
                text="Save"
                loadingText="Saving…"
              />
              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                isLoading={this.state.isDeleting}
                onClick={this._handleDelete}
                text="Delete"
                loadingText="Deleting…"
              />
            </form>)}
        </div>
    );
  }
}

export default withRouter(Notes);
