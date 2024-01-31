import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoStack } from './dynamo-stack';
import { LambdaStack } from './lambda-stack';

/**
 * This Stack creates the IAM policy for the Karmacart API.
 */
export class IamStack extends Stack {

  constructor(scope: Construct, id: string, lambdaStack: LambdaStack, dynamoStack: DynamoStack, props?: StackProps) {
    super(scope, id, props);

    dynamoStack.companyTable.grantReadData(lambdaStack.findAllCompaniesLambda);
    dynamoStack.companyTable.grantReadData(lambdaStack.findOneCompanyLambda);
  }
}
