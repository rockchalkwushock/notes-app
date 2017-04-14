import AWS from 'aws-sdk';
import getAwsCredentials from './getAWSCreds';
import { Bucket } from './awsVars';

export default async(file, userToken) => {
  console.log('____FILE_ARG____');
  console.log(file);
  console.log('______________');
  await getAwsCredentials(userToken);
  const s3 = new AWS.S3({ params: { Bucket }});
  console.log('____S3_BUCKET____');
  console.log(s3);
  console.log('______________');
  const filename = `${AWS.config.credentials.identityId}-${Date.now()}-${file.name}`;
  console.log(`Filename: ${filename}`);
  const promise = new Promise((resolve, reject) => (
    s3.upload({
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    },
    (error, result) => {
      console.log('____RESULT____');
      console.log(result);
      console.log('______________');
      console.log('____ERROR____');
      console.log(error);
      console.log('______________');
      if (error) {
        reject(error);
        return;
      }
      resolve(result.Location);
    })
  ));
  console.log('____PROMISE____');
  console.log(promise);
  console.log('______________');
  return promise;
}
