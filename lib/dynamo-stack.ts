import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import * as customResources from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs';
import { COMPANY_TABLE } from '../src/const/dynamo.const';
import { seedData } from '../seed-data/seed-data';

/**
 * This Stack creates the Dynamo DB for the Karmacart API.
 */
export class DynamoStack extends Stack {
  public readonly companyTable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.companyTable = new dynamo.Table(this, "CompanyTable", {
      tableName: COMPANY_TABLE,
      partitionKey: {
        name: 'pk',
        type: dynamo.AttributeType.STRING
      },
      billingMode: dynamo.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 1,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const awsSdkCall: customResources.AwsSdkCall = {
      service: 'DynamoDB',
      action: 'batchWriteItem',
      parameters: {
          RequestItems: { 
            CompanyTable: seedData
          }
      },
      physicalResourceId: customResources.PhysicalResourceId.of(this.companyTable.tableName + '_initialization')
    }

    new customResources.AwsCustomResource(this, 'initTable', {
      onUpdate: awsSdkCall,
      onCreate: awsSdkCall,
      policy: customResources.AwsCustomResourcePolicy.fromSdkCalls({ resources: customResources.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
  }
}