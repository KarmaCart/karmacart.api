import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context) {
  
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(`update-company-preference success!`),
  };

  return response;
}

export { handler };