#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KarmaCartApiStack } from '../lib/karmacart-api-stack';

const awsAccountNumber = process.env.AWS_ACCOUNT_NUMBER;

const app = new cdk.App();
new KarmaCartApiStack(app, 'KarmacartApiStack', {
  env: {
    region: 'us-east-1',
    account: awsAccountNumber
  }
});