import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { ClientId, UserPoolId } from '../../libs';
import { LoaderButton } from '../../components';
import './Signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      username: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null,
    };
  }
  _validateForm() {
    return this.state.username.length > 0
      && this.state.password.length > 0
      && this.state.password === this.state.confirmPassword;
  }
  _validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }
  _handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }
  _handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const newUser = await this._signup(this.state.username, this.state.password);
      this.setState({ newUser });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }
  _handleConfirmationSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await this._confirm(this.state.newUser, this.state.confirmationCode);
      const userToken = await this._authenticate(
        this.state.newUser,
        this.state.username,
        this.state.password
      );
      this.props.updateUserToken(userToken);
      this.props.history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  _signup(username, password) {
    const userPool = new CognitoUserPool({ UserPoolId, ClientId });
    const attributeEmail = new CognitoUserAttribute({ Name: 'email', Value: username });
    return new Promise((resolve, reject) => (
      userPool.signUp(username, password, [attributeEmail], null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      })
    ));
  }
  _confirm(user, confirmationCode) {
    return new Promise((resolve, reject) => (
      user.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
    ));
  }
  _authenticate(user, username, password) {
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    return new Promise((resolve, reject) => (
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
        onFailure: (err) => reject(err),
      })
    ));
  }
  _renderConfirmationForm() {
    return (
      <form onSubmit={this._handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this._handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this._validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }
  _renderForm() {
    return (
      <form onSubmit={this._handleSubmit}>
        <FormGroup controlId="username" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.username}
            onChange={this._handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this._handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this._handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this._validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }
  render() {
    return (
      <div className="Signup">
        { this.state.newUser === null
          ? this._renderForm()
          : this._renderConfirmationForm() }
      </div>
    );
  }
}

export default withRouter(Signup);
