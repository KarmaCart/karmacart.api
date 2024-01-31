import { Stack, StackProps } from 'aws-cdk-lib';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

/**
 * This Stack creates the Dynamo DB for the Karmacart API.
 */
export class DynamoStack extends Stack {
  public readonly companyTable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.companyTable = new dynamo.Table(this, "CompanyTable", {
      tableName: 'Company',
      partitionKey: {
        name: 'pk',
        type: dynamo.AttributeType.STRING
      },
      billingMode: dynamo.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 1,
    });
  }
}