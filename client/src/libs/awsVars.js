const apiURL = process.env.REACT_APP_API_GATEWAY_URL;
const Bucket = process.env.REACT_APP_S3_BUCKET;
const ClientId = process.env.REACT_APP_CLIENT_ID;
const IdentityPoolId = process.env.REACT_APP_IDENTITY_POOL;
const region = process.env.REACT_APP_REGION;
const size = process.env.REACT_APP_MAX_ATTACHMENT_SIZE;
const UserPoolId = process.env.REACT_APP_USER_POOL_ID;

export {
  apiURL,
  Bucket,
  ClientId,
  IdentityPoolId,
  region,
  size,
  UserPoolId,
};
