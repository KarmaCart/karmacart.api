import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context) {

  
  
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(`find-one-company id: ${event.pathParameters?.id} success!`),
  };

  return response;
}

export { handler };