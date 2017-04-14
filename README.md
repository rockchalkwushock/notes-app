# Notes-App

Tutorial on Serverless...**WIP**

This repository is based off of the following [tutorial](http://serverless-stack.com).

## Prerequisites

You will need to have an AWS account to operate this code base.

You can set one up [here](https://aws.amazon.com).

You will also need the following installed globally:

```bash
brew install awscli # macOS or Linux
npm install severless -g
```

You will need to setup the following AWS Services:

```plaintext
AWS API GATEWAY
AWS DynamoDB
AWS S3
AWS Cognito
```

## Usage of Repository

1. Create a `serverless.env.yml` file in `./api`.
1. It should contain your AWS User Pool Arn.

```yml
AWS_POOL_ARN: YOUR ARN HERE
```


From the root directory:

```bash
# Set your AWS Credentials
aws configure
AWS Access Key ID [None]: # Your ID
AWS Secret Access Key [None]: # Your Secret Key
Default region name [None]: # defaults to us-east-1
Default output format [None]: # not needed

# Establish an authenticated user in the dynamoDB
aws cognito-idp sign-up /
  --client-id YOUR_COGNITO_APP_CLIENT_ID /
  --username admin@example.com /
  --password Passw0rd! /
  --user-attributes Name=email,Value=admin@example.com
# then...
aws cognito-idp admin-confirm-sign-up /
  --user-pool-id YOUR_USER_POOL_ID /
  --username admin@example.com

# Deploy to AWS API GATEWAY
sls deploy

# Test the API
aws cognito-idp admin-initiate-auth /
  --region us-east-1 /
  --user-pool-id YOUR_COGNITO_USER_POOL_ID /
  --client-id YOUR_COGNITO_APP_CLIENT_ID /
  --auth-flow ADMIN_NO_SRP_AUTH /
  --auth-parameters USERNAME=admin@example.com,PASSWORD=Passw0rd!

### output

{
    "AuthenticationResult": {
        "ExpiresIn": 3600,
        "IdToken": "a really long string", # This is your Identity Pool ID
        "RefreshToken": "a similarly really long string",
        "TokenType": "Bearer",
        "AccessToken": "and another"
    },
    "ChallengeParameters": {}
}

curl <YOUR POST ENDPOINT> /
  -H "Authorization:<IDENTITY POOL ID>" /
  -d "{\"content\":\"hello world\",\"attachment\":\"hello.jpg\"}"

### output

{
  "userId": <userId>,
  "noteId": <noteId>,
  "content": "hello world",
  "attachment": "hello.jpg",
  "createdAt": <timestamp>
}
```

## API

Please refer to the [API Documentation](https://github.com/rockchalkwushock/notes-app/blob/master/api/API.md).

## TODO

- [ ] Test endpoints using `jest`.
- [ ] Add coverage using `codecov`.
- [ ] Integrate `graphql`.
- [ ] Build Front-end Views using `react`.
- [ ] Better internal & external documentation.