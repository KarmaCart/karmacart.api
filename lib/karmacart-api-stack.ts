import { Stack, StackProps } from 'aws-cdk-lib';
import { ApiMapping, CfnStage, CorsHttpMethod, DomainName, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
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
    const nodeRuntime = Runtime.NODEJS_20_X
    
    // Create Lambda functions...
    const findOneCompanyLambda = new NodejsFunction(this, "FindOneCompanyLambda", {
      runtime: nodeRuntime,
      handler: "handler",
      functionName: "karmacart-api-find-one-company-func",
      entry: handlersDirectory + "/find-one-company.ts",
    });

    const findAllCompaniesLambda = new NodejsFunction(this, "FindAllCompaniesLambda", {
      runtime: nodeRuntime,
      handler: "handler",
      functionName: "karmacart-api-find-all-companies-func",
      entry: handlersDirectory + "/find-all-companies.ts",
    });
    // ...Lambda functions
    
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
      disableExecuteApiEndpoint: true,

    });

    const defaultStage = karmaCartApi.defaultStage?.node.defaultChild as CfnStage;

    // Define throttle settings for the default stage.
    defaultStage.defaultRouteSettings = {
      throttlingBurstLimit: 5,
      throttlingRateLimit: 10
    };
    
    const findOneCompanyIntegration = new HttpLambdaIntegration('FindOneCompanyIntegration',findOneCompanyLambda);
    
    // Create a find one company resource and method for the API
    karmaCartApi.addRoutes({
      path: '/company/{id}',
      methods: [ HttpMethod.GET],
      integration: findOneCompanyIntegration,
    });

    const findAllCompaniesIntegration = new HttpLambdaIntegration('FindAllCompaniesIntegration',findAllCompaniesLambda);
    
    // Create a find all companies resource and method for the API
    karmaCartApi.addRoutes({
      path: '/company',
      methods: [ HttpMethod.GET],
      integration: findAllCompaniesIntegration,
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
