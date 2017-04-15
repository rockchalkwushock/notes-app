import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { redirectQuery } from '../libs';

export default ({ component: C, props: cProps, ...rest }) => {
  const redirect = redirectQuery('redirect');
  return (
    <Route
      {...rest}
      render={props => (
        cProps.userToken === null
        ? <C {...props} {...cProps} />
        : <Redirect
            to={(redirect === '' || redirect === null)
              ? '/' : redirect}
          />
      )}
    />
  );
};