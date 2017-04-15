import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  Authenticated,
  AppliedRoute,
  UnAuthenticated,
} from './components';
import {
  Home,
  Login,
  NewNote,
  Notes,
  NotFound,
  Signup,
} from './containers';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnAuthenticated path="/login" exact component={Login} props={childProps} />
    <UnAuthenticated path="/signup" exact component={Signup} props={childProps} />
    <Authenticated path="/notes/new" exact component={NewNote} props={childProps} />
    <Authenticated path="/notes/:id" exact component={Notes} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>
);
