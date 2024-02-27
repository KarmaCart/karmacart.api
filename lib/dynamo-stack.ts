import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import * as customResources from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs';
import { ALL_PRODUCTS_BY_NAME_INDEX, COMPANY_TABLE, PRODUCT_INDEX } from '../src/const/dynamo.const';
import { seedData } from '../seed-data/seed-data';

/**
 * This Stack creates the Dynamo DB for the Karmacart API.
 */
export class DynamoStack extends Stack {
  public readonly companyTable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.companyTable = new dynamo.Table(this, COMPANY_TABLE, {
      tableName: COMPANY_TABLE,
      partitionKey: {
        name: 'pk',
        type: dynamo.AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: dynamo.AttributeType.STRING
      },
      billingMode: dynamo.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 1,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const skPkGsiProps: dynamo.GlobalSecondaryIndexProps = {
      indexName: PRODUCT_INDEX,
      partitionKey: {
        name: 'sk',
        type: dynamo.AttributeType.STRING,
      },
      projectionType: dynamo.ProjectionType.ALL,
      readCapacity: 5,
      writeCapacity: 1,
    };

    this.companyTable.addGlobalSecondaryIndex(skPkGsiProps)

    const allProductsByNameGsiProps: dynamo.GlobalSecondaryIndexProps = {
      indexName: ALL_PRODUCTS_BY_NAME_INDEX,
      partitionKey: {
        name: 'allProductsGSIPK',
        type: dynamo.AttributeType.STRING,
      },
      sortKey: {
        name: 'productName',
        type: dynamo.AttributeType.STRING,
      },
      projectionType: dynamo.ProjectionType.ALL,
      readCapacity: 5,
      writeCapacity: 1,
    };

    this.companyTable.addGlobalSecondaryIndex(allProductsByNameGsiProps)

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