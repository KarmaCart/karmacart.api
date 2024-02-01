#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { DynamoStack } from '../lib/dynamo-stack';
import { IamStack } from '../lib/iam-stack';

const awsAccountNumber = process.env.AWS_ACCOUNT_NUMBER;

const app = new cdk.App();

const lambdaStack = new LambdaStack(app, 'KarmacartApiLambdaStack', {
  env: {
    region: 'us-east-1',
    account: awsAccountNumber
  }
});

const apiGatewayStack = new ApiGatewayStack(app, 'KarmacartApiGatewayStack', lambdaStack, {
  env: {
    region: 'us-east-1',
    account: awsAccountNumber
  }
});

const dynamoStack = new DynamoStack(app, 'KarmacartApiDynamoStack', {
  env: {
    region: 'us-east-1',
    account: awsAccountNumber
  }
});

new IamStack(app, 'KarmacartApiIamStack', lambdaStack, dynamoStack, {
  env: {
    region: 'us-east-1',
    account: awsAccountNumber
  }
});

apiGatewayStack.addDependency(lambdaStack)
lambdaStack.addDependency(dynamoStack)