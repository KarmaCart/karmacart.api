import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { ApiMapping, CfnDomainName, CorsHttpMethod, DomainName, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

/**
 * This Stack creates the Lambda based API for the KarmaCart application.
 */
export class KarmaCartApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const envLevel = process.env.KARMACART_ENV_LEVEL

    const rootDomain = 'andersbuck.dev';
    const uiDomain = `karma-cart-${envLevel}.${rootDomain}`
    const apiDomain = `karma-cart-api-${envLevel}.${rootDomain}`

    const handlersDirectory = join(__dirname, "..", "src", "handlers")
    
    // Create a Lambda function
    const findOneCompanyLambda = new NodejsFunction(this, "FindOneCompanyLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      functionName: "karmacart-api-get-company-func",
      entry: handlersDirectory + "/find-one-company.ts",
    });
    
    // Create an API Gateway 
    const karmaCartApi = new HttpApi(this, "KarmaCartApi", {
      apiName: "KarmaCart API",
      corsPreflight: {
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.PUT,
          CorsHttpMethod.POST,
        ],
        allowOrigins: [`https://${uiDomain}`],
      },
      disableExecuteApiEndpoint: true
    });
    
    const findOneCompanyIntegration = new HttpLambdaIntegration('FindOneCompanyIntegration',findOneCompanyLambda);
    
    // Create a resource and method for the API
    karmaCartApi.addRoutes({
      path: '/company',
      methods: [ HttpMethod.GET],
      integration: findOneCompanyIntegration,
    });
    
    // Create Certificate
    const cert = new Certificate(
      this,
      'Certificate',
      {
        domainName: apiDomain,
        validation: CertificateValidation.fromDns(),
      }
    );
    
    // Create a custom domain
    const customDomainName = new DomainName(this, 'DomainName', {
      domainName: apiDomain,
      certificate: cert
    });
    
    // API mapping
    new ApiMapping(this, 'ApiMapping', {
      api: karmaCartApi,
      domainName: customDomainName,
    });
  }
}
