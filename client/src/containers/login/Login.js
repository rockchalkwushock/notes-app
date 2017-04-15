import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { ClientId, UserPoolId } from '../../libs';
import { LoaderButton } from '../../components';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      username: '',
      password: '',
    };
  }
  _validateForm() {
    return this.state.username.length > 0
      && this.state.password.length > 0;
  }
  _handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  _handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const userToken = await this._login(this.state.username, this.state.password);
      this.props.updateUserToken(userToken);
    }
    catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  _login(username, password) {
    const userPool = new CognitoUserPool({ UserPoolId, ClientId });
    const authenticationData = {
      Username: username,
      Password: password
    };

    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => (
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
        onFailure: (err) => reject(err),
      })
    ));
  }
  render() {
    return (
      <div className="Login">
        <form onSubmit={this._handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.username}
              onChange={this._handleChange} />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this._handleChange}
              type="password" />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={ ! this._validateForm() }
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}

export default withRouter(Login);