import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { invokeApi } from '../../libs';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      notes: [],
    };
  }
  async componentWillMount() {
    if (this.props.userToken === null) {
      return;
    }
    this.setState({ isLoading: true });
    try {
      const results = await this._notes();
      this.setState({ notes: results });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }
  _notes() {
    return invokeApi({ path: '/notes' }, this.props.userToken);
  }
  _renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) => (
      i !== 0
        ? (<ListGroupItem
          key={note.noteId}
          href={`/notes/${note.noteId}`}
          onClick={this._handleNoteClick}
          header={note.content.trim().split('\n')[0]}
        >
                { `Created: ${(new Date(note.createdAt)).toLocaleString()}` }
            </ListGroupItem>)
        : (<ListGroupItem
          key="new"
          href="/notes/new"
          onClick={this._handleNoteClick}
        >
                <h4><b>{'\uFF0B'}</b> Create a new note</h4>
            </ListGroupItem>)
    ));
  }
  _handleNoteClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }
  _renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }
  _renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          { !this.state.isLoading
            && this._renderNotesList(this.state.notes) }
        </ListGroup>
      </div>
    );
  }
  render() {
    return (
      <div className="Home">
        { this.props.userToken === null
          ? this._renderLander()
          : this._renderNotes() }
      </div>
    );
  }
}

export default withRouter(Home);
