import * as cdk from 'aws-cdk-lib';
import * as KarmacartApi from '../lib/karmacart-api-stack';

test('SQS Queue Created', () => {
  const app = new cdk.App();
  const stack = new KarmacartApi.KarmaCartApiStack(app, 'MyTestStack');
});
