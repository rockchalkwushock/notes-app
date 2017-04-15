import AWS from 'aws-sdk';
import { IdentityPoolId, region, UserPoolId } from './awsVars';

export default userToken => {
  const authenticator = `cognito-idp.${region}.amazonaws.com/${UserPoolId}`;
  console.log(authenticator);
  AWS.config.update({ region });
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId,
    Logins: {
      [authenticator]: userToken
    }
  });
  return new Promise((resolve, reject) => (
    AWS.config.credentials.get((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    })
  ));
}