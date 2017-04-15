import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import { RouteNavItem } from './components';
import { ClientId, UserPoolId } from './libs';
import Routes from './Routes';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLoadingUserToken: true,
    };
  }
  async componentWillMount() {
    const currentUser = this._getCurrentUser();

    if (currentUser === null) {
      this.setState({ isLoadingUserToken: false });
      return;
    }

    try {
      const userToken = await this._getUserToken(currentUser);
      this._updateUserToken(userToken);
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoadingUserToken: false });
  }
  _updateUserToken = (userToken) => {
    this.setState({
      userToken,
    });
  }
  _handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }
  _handleLogout = () => {
    const currentUser = this._getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }
    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
    }
    this._updateUserToken(null);
    this.props.history.push('/login');
  }
  _getCurrentUser() {
    const userPool = new CognitoUserPool({ UserPoolId, ClientId });
    return userPool.getCurrentUser();
  }
  _getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }
  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this._updateUserToken,
    };
    return !this.state.isLoadingUserToken &&
    (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              { this.state.userToken ?
                <NavItem onClick={this._handleLogout}>Logout</NavItem>
                :
              [
                <RouteNavItem key={1} onClick={this._handleNavLink} href="/signup">Signup</RouteNavItem>,
                <RouteNavItem key={2} onClick={this._handleNavLink} href="/login">Login</RouteNavItem>,
              ]
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
