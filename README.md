# karmacart.api

This is an API project whose infrastructure is defined using AWS CDK in /lib and /bin. API functionality is implemented in src/handlers.

The `cdk.json` file tells the CDK Toolkit how to execute this app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Deployment

### Pre Deployment
- export AWS_PROFILE
- export AWS_ACCOUNT_NUMBER
- export KARMACART_ENV_LEVEL, e.g. 'eng', 'test', 'prod' etc...

### During Deployment
Create CNAME DNS record with Name and Target provided by the ACM certificate in this stack.

### Post Deployment
Create CNAME DNS record with the custom domain name and url generated in API Gateway from this stack.
