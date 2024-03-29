import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

/**
 * This Stack creates the API Lambdas for the Karmacart API.
 */
export class LambdaStack extends Stack {
  public readonly findOneCompanyLambda;
  public readonly findAllCompaniesLambda;
  public readonly findAllProductsLambda;
  public readonly findOneProductLambda;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handlersDirectory = join(__dirname, "..", "src", "handlers");
    const nodeRuntime = Runtime.NODEJS_20_X;
    
    this.findOneCompanyLambda = new NodejsFunction(this, "FindOneCompanyLambda", {
      runtime: nodeRuntime,
      handler: "handler",
      functionName: "karmacart-api-find-one-company-func",
      entry: handlersDirectory + "/find-one-company.ts",
    });

    this.findAllCompaniesLambda = new NodejsFunction(this, "FindAllCompaniesLambda", {
      runtime: nodeRuntime,
      handler: "handler",
      functionName: "karmacart-api-find-all-companies-func",
      entry: handlersDirectory + "/find-all-companies.ts",
    });

    this.findAllProductsLambda = new NodejsFunction(this, "FindAllProductsLambda", {
      runtime: nodeRuntime,
      handler: "handler",
      functionName: "karmacart-api-find-all-products-func",
      entry: handlersDirectory + "/find-all-products.ts",
    });

    this.findOneProductLambda = new NodejsFunction(this, "FindOneProductLambda", {
      runtime: nodeRuntime,
      handler: "handler",
      functionName: "karmacart-api-find-one-product-func",
      entry: handlersDirectory + "/find-one-product.ts",
    });
  }
}
