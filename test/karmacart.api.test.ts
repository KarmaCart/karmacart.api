import * as cdk from 'aws-cdk-lib';
import * as KarmacartApi from '../lib/api-gateway-stack';
import { LambdaStack } from '../lib/lambda-stack';

test('SQS Queue Created', () => {
  const app = new cdk.App();
  const lambdaStack = new LambdaStack(app, 'MyTestLambdaStack')
  const stack = new KarmacartApi.ApiGatewayStack(app, 'MyTestStack', lambdaStack);
});
