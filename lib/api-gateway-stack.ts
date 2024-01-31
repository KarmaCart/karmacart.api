import { Stack, StackProps } from 'aws-cdk-lib';
import { ApiMapping, CfnStage, CorsHttpMethod, DomainName, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { LambdaStack } from './lambda-stack';

/**
 * This Stack creates the Lambda based API for the KarmaCart application.
 */
export class ApiGatewayStack extends Stack {

  constructor(scope: Construct, id: string, lambdaStack: LambdaStack, props?: StackProps) {
    super(scope, id, props);

    const envLevel = process.env.KARMACART_ENV_LEVEL;

    const rootDomain = 'andersbuck.dev';
    const uiDomain = (envLevel !== 'prod') ? `karma-cart-${envLevel}.${rootDomain}` : `karma-cart.${rootDomain}`;
    const apiDomain = (envLevel !== 'prod') ? `karma-cart-api-${envLevel}.${rootDomain}` : `karma-cart-api.${rootDomain}`;
    
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
      throttlingBurstLimit: 10,
      throttlingRateLimit: 5
    };
    
    const findOneCompanyIntegration = new HttpLambdaIntegration('FindOneCompanyIntegration', lambdaStack.findOneCompanyLambda);
    
    // Create a find one company resource and method for the API
    karmaCartApi.addRoutes({
      path: '/company/{id}',
      methods: [ HttpMethod.GET],
      integration: findOneCompanyIntegration,
    });

    const findAllCompaniesIntegration = new HttpLambdaIntegration('FindAllCompaniesIntegration', lambdaStack.findAllCompaniesLambda);
    
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
