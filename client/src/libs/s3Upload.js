import AWS from 'aws-sdk';
import getAwsCredentials from './getAWSCreds';
import { Bucket } from './awsVars';

export default async(file, userToken) => {
  await getAwsCredentials(userToken);
  const s3 = new AWS.S3({ params: { Bucket } });
  const filename = `${AWS.config.credentials.identityId}-${Date.now()}-${file.name}`;
  return new Promise((resolve, reject) => (
    s3.upload({
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result.Location);
    })
  ));
};
